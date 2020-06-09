#include "c008_cron.h"
#include "../lib/rule_engine.h"

static const char *TAG = "CronPlugin";

PLUGIN_CONFIG(CronPlugin, t1_enabled, t2_enabled, t3_enabled, t4_enabled)
PLUGIN_STATS(CronPlugin, state, state)

struct cron_expr_t {
    cron_expr expr;
    esp_timer_handle_t timer;
    void *callback;
};

struct cron_expr_t *cron_expression[10];
uint8_t cron_expr_cnt = 0;

static void timer_callback (void *arg) {
    uint32_t i = (uint32_t)arg;
    ESP_LOGI(TAG, "checking cron expression %d on %p", i, (void*)cron_expression[i]->callback);

    run_rule((unsigned char*)cron_expression[i]->callback, nullptr, 0, 255);

    time_t cur = time(NULL);
    time_t next = cron_next(&cron_expression[i]->expr, cur);
    double delay_seconds = difftime(next, cur);

    ESP_LOGI(TAG, "calculating next time to run ... %f", delay_seconds);

    esp_timer_stop(cron_expression[i]->timer);
    ESP_ERROR_CHECK(esp_timer_start_once(cron_expression[i]->timer, ((uint64_t)delay_seconds) * 1000000));
}

void CronPlugin::addCron(unsigned char *expr_string, void* callback) {
    cron_expression[cron_expr_cnt] = (cron_expr_t*)malloc(sizeof(cron_expr_t));

    ESP_LOGI(TAG, "adding expression %s", expr_string);
    const char* err = NULL;
    memset(&cron_expression[cron_expr_cnt]->expr, 0, sizeof(cron_expression[cron_expr_cnt]->expr));
    cron_parse_expr((char*)expr_string, &cron_expression[cron_expr_cnt]->expr, &err);
    if (err) {
        ESP_LOGW(TAG, "invalid expression");
    }

    cron_expression[cron_expr_cnt]->callback = callback;
    time_t cur = time(NULL);
    time_t next = cron_next(&cron_expression[cron_expr_cnt]->expr, cur);
    double delay_seconds = difftime(next, cur);

    ESP_LOGI(TAG, "calculating next time to run ... %f", delay_seconds);

    uint32_t delay = delay_seconds * 1000000;
    esp_timer_create_args_t timer_args = {};
    timer_args.callback = &timer_callback;
    timer_args.arg = (void*)cron_expr_cnt;
    timer_args.name = "dimmer";
    ESP_ERROR_CHECK(esp_timer_create(&timer_args, &cron_expression[cron_expr_cnt]->timer));
    ESP_ERROR_CHECK(esp_timer_start_once(cron_expression[cron_expr_cnt]->timer, delay));
    cron_expr_cnt++;
}

bool CronPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params);
    state_cfg = &((JsonArray &)params["state"]);

    return true;
}

