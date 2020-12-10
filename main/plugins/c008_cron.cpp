#include "c008_cron.h"
#include "../lib/rule_engine.h"

static const char *TAG = "CronPlugin";

PLUGIN_CONFIG(CronPlugin, t1_enabled, t2_enabled, t3_enabled, t4_enabled)
PLUGIN_STATS(CronPlugin, state, state)

struct cron_expr_t {
    cron_expr expr;
    esp_timer_handle_t timer;
    void *callback;
    bool ready;
};

#define MAX_CRON_JOBS 10
struct cron_expr_t *cron_expression[MAX_CRON_JOBS];
uint8_t cron_expr_cnt = 0;

static void timer_callback (void *arg) {
    uint32_t i = (uint32_t)arg;
    ESP_LOGI(TAG, "checking cron expression %d on %p", i, (void*)cron_expression[i]->callback);

    uint64_t delay = 60000000ULL;
    if (!ntp_plugin || !ntp_plugin->hasTime) {
        ESP_LOGE(TAG, "time is not available, retrying in one minute");
    } else {


        time_t cur = time(NULL);
        struct tm * timeinfo = localtime(&cur);
        ESP_LOGI(TAG, "current time: %s", asctime(timeinfo));

        time_t next = cron_next(&cron_expression[i]->expr, cur);
        time_t prev = cron_prev(&cron_expression[i]->expr, cur);
        double delay_seconds = difftime(next, cur);
        double delay_last = difftime(cur, prev);
        if (delay_last > 60) {
            ESP_LOGW(TAG, "cron triggered at wrong time");
        }
        delay = delay_seconds * 1000000;

//        ESP_LOGI(TAG, "next run: %s", ctime(&next));
//        ESP_LOGI(TAG, "prev run: %s", ctime(&prev));
        ESP_LOGI(TAG, "calculating last time to run ... %f hours, %f minutes, %f seconds", delay_last/60/60, delay_last/60, delay_last);
        ESP_LOGI(TAG, "calculating next time to run ... %f hours, %f minutes, %f seconds", delay_seconds/60/60, delay_seconds/60, delay_seconds);

        if (cron_expression[i]->ready && delay_last > 60) {
            ESP_LOGI(TAG, "executing cron job");
            // todo: move to separate task (events ?)
            run_rule((unsigned char*)cron_expression[i]->callback, nullptr, 0, 255);
        }

        cron_expression[i]->ready = true;
    }

    esp_timer_stop(cron_expression[i]->timer);
    ESP_ERROR_CHECK(esp_timer_start_once(cron_expression[i]->timer, delay));
}

void CronPlugin::addCron(unsigned char *expr_string, void* callback) {

    if (cron_expr_cnt == MAX_CRON_JOBS) {
        ESP_LOGE(TAG, "cron job list is full");
        return;
    }

    cron_expression[cron_expr_cnt] = (cron_expr_t*)malloc(sizeof(cron_expr_t));

    ESP_LOGI(TAG, "adding expression %s", expr_string);
    const char* err = NULL;
    memset(&cron_expression[cron_expr_cnt]->expr, 0, sizeof(cron_expression[cron_expr_cnt]->expr));
    cron_parse_expr((char*)expr_string, &cron_expression[cron_expr_cnt]->expr, &err);
    if (err) {
        ESP_LOGW(TAG, "invalid expression: %s", err);
        return;
    }

    cron_expression[cron_expr_cnt]->callback = callback;
    cron_expression[cron_expr_cnt]->ready = false;

    esp_timer_create_args_t timer_args = {};
    timer_args.callback = &timer_callback;
    timer_args.arg = (void*)cron_expr_cnt;
    timer_args.name = "cron";
    ESP_ERROR_CHECK(esp_timer_create(&timer_args, &cron_expression[cron_expr_cnt]->timer));
    ESP_ERROR_CHECK(esp_timer_start_once(cron_expression[cron_expr_cnt]->timer, 10000000ULL));
    cron_expr_cnt++;
}

bool CronPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params);
    state_cfg = &((JsonArray &)params["state"]);

    return true;
}

