#include "c008_cron.h"
#include "../lib/rule_engine.h"

static const char *TAG = "CronPlugin";

PLUGIN_CONFIG(CronPlugin, t1_enabled, t2_enabled, t3_enabled, t4_enabled)
PLUGIN_STATS(CronPlugin, state, state)

struct cron_expr_t {
    cron_expr expr = {};
    esp_timer_handle_t timer;
    void *callback;
};

struct cron_expr_t *cron_expression[10];
uint8_t cron_expr_cnt = 0;

static void timer_callback (void *arg) {
    uint32_t i = (uint32_t)arg;
    run_rule((unsigned char*)cron_expression[i]->callback, nullptr, 0, 255);

    time_t cur = time(NULL);
    time_t next = cron_next(&cron_expression[cron_expr_cnt]->expr, cur);
    uint32_t delay = next - cur;

    esp_timer_stop(cron_expression[i]->timer);
    ESP_ERROR_CHECK(esp_timer_start_once(cron_expression[i]->timer, delay));
}

void CronPlugin::addCron(unsigned char *expr_string, void* callback) {
    cron_expression[cron_expr_cnt] = (cron_expr_t*)malloc(sizeof(cron_expr_t));

    const char* err = NULL;
    cron_parse_expr((char*)expr_string, &cron_expression[cron_expr_cnt]->expr, &err);
    if (err) {
        ESP_LOGW(TAG, "invalid expression");
    }
    time_t cur = time(NULL);
    time_t next = cron_next(&cron_expression[cron_expr_cnt]->expr, cur);
    uint32_t delay = next - cur;
    
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

