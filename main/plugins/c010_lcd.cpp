#include "c010_lcd.h"

//extern Config *cfg;
extern Plugin *active_plugins[10];

static const char *TAG = "LcdPlugin";

PLUGIN_CONFIG(LcdPlugin, enabled, enabled)
PLUGIN_STATS(LcdPlugin, state, state)

static lv_res_t slider_action(lv_obj_t * slider);
static lv_res_t btn_action(lv_obj_t * slider);

/**
 * draws a left aligned label + right aligned slider
 */
static lv_obj_t* slider_create(lv_obj_t * parent, char* label, int value) {

	lv_obj_t * box1;
	box1 = lv_obj_create(parent, NULL);
	//lv_obj_set_style(box1, &lv_style_pretty);
	lv_obj_set_width(box1, LV_HOR_RES - 10);
	lv_obj_set_height(box1, 50);

	//lv_cont_set_fit(box1, false, true);

	lv_obj_t * title = lv_label_create(box1, NULL);
	lv_label_set_text(title, label);
	lv_obj_align(title, NULL, LV_ALIGN_IN_LEFT_MID, 10, 0);  /*Align to the top*/

	lv_obj_t * slider = lv_slider_create(box1, NULL);
	lv_obj_set_size(slider, LV_HOR_RES / 2, LV_DPI / 3);
	lv_obj_align(slider, NULL, LV_ALIGN_IN_RIGHT_MID, -10, 0); /*Align to below the chart*/
	lv_slider_set_action(slider, slider_action);
	lv_slider_set_range(slider, 0, 255);
	lv_slider_set_value(slider, value);
	return box1;
}

static lv_obj_t* button_create(lv_obj_t * parent, char* label, int value) {

	lv_obj_t * box1;
	box1 = lv_obj_create(parent, NULL);
	//lv_obj_set_style(box1, &lv_style_pretty);
	lv_obj_align(box1, NULL, LV_ALIGN_IN_TOP_LEFT, 0, 0);
	lv_obj_set_width(box1, LV_HOR_RES - 10);
	lv_obj_set_height(box1, 50);

	lv_obj_t * title = lv_label_create(box1, NULL);
	lv_label_set_text(title, label);
	lv_obj_align(title, NULL, LV_ALIGN_IN_LEFT_MID, 10, 0);  /*Align to the top*/

	lv_obj_t *sw1 = lv_sw_create(box1, NULL);
	lv_obj_align(sw1, NULL, LV_ALIGN_IN_RIGHT_MID, -10, 0);
	return box1;
}

static lv_obj_t* value_create(lv_obj_t * parent, char* label, char* valueText) {

	lv_obj_t * box1;
	box1 = lv_obj_create(parent, NULL);
	lv_obj_align(box1, NULL, LV_ALIGN_IN_TOP_LEFT, 0, 0);
	lv_obj_set_width(box1, LV_HOR_RES - 10);
	lv_obj_set_height(box1, 50);

	lv_obj_t * title = lv_label_create(box1, NULL);
	lv_label_set_text(title, label);
	lv_obj_align(title, NULL, LV_ALIGN_IN_LEFT_MID, 10, 0);  /*Align to the top*/

	lv_obj_t * value = lv_label_create(box1, NULL);
	lv_label_set_text(value, valueText);
	lv_obj_align(value, NULL, LV_ALIGN_IN_RIGHT_MID, -lv_obj_get_width(value), 0);  /*Align to the top*/
	return box1;
}


static void page_create()
{
    lv_obj_t *scr = lv_obj_create(NULL, NULL);
    lv_scr_load(scr);

    lv_theme_t *th = lv_theme_alien_init(100, NULL);
    lv_theme_set_current(th);

	static lv_style_t style_sb;
	lv_style_copy(&style_sb, &lv_style_plain);
	style_sb.body.main_color = LV_COLOR_BLACK;
	style_sb.body.grad_color = LV_COLOR_BLACK;
	style_sb.body.border.color = LV_COLOR_WHITE;
	style_sb.body.border.width = 0;
	style_sb.body.radius = 0;
	style_sb.body.opa = LV_OPA_60;
	style_sb.body.padding.hor = 3;          /*Horizontal padding on the right*/
	style_sb.body.padding.ver = 0;
	style_sb.body.padding.inner = 8;        /*Scrollbar width*/

	/*Create a page*/
	lv_obj_t * page = lv_page_create(lv_scr_act(), NULL);
	//lv_obj_set_width(page, LV_HOR_RES);
	lv_obj_set_size(page, LV_HOR_RES, LV_VER_RES);
	lv_obj_align(page, NULL, LV_ALIGN_IN_TOP_LEFT, 0, 0);
	lv_page_set_style(page, LV_PAGE_STYLE_SB, &style_sb);
	lv_page_set_sb_mode(page, LV_SB_MODE_ON);

    lv_obj_t* element;
    lv_obj_t* prev = NULL;
    for (auto p : active_plugins) {
        if (p == NULL) continue;

        // each widget should have
        // - create function
        // - update function
        // - destroy function
        // - action function
        
        switch (p->p_type) {
            case 1: // SWITCH
                // pass pointer to value
                element = button_create(page, (char*)p->name, 0);
                lv_page_glue_obj(element, true);
                lv_obj_align(element, prev, prev ? LV_ALIGN_OUT_BOTTOM_MID : LV_ALIGN_IN_TOP_MID, 0, 0);
                prev = element;
                break;
            case 2: case 3: case 4: case 6: case 14:
                // walk over all states, get their names and their values
                element = value_create(page, "humidity", "47");
                lv_page_glue_obj(element, true);
	            lv_obj_align(element, prev, prev ? LV_ALIGN_OUT_BOTTOM_MID : LV_ALIGN_IN_TOP_MID, 0, 0);
                prev = element;
                break;
            case 5: // REGULATOR
                element = slider_create(page, (char*)p->name, 25);
                lv_page_glue_obj(element, true);
                lv_obj_align(element, prev, prev ? LV_ALIGN_OUT_BOTTOM_MID : LV_ALIGN_IN_TOP_MID, 0, 0);
                prev = element;
                break;
            case 15:// DIMMER
                // walk over all dimmer states
                element = slider_create(page, "R", 25);
                lv_page_glue_obj(element, true);
                lv_obj_align(element, prev, prev ? LV_ALIGN_OUT_BOTTOM_MID : LV_ALIGN_IN_TOP_MID, 0, 0);
                prev = element;
                break;

        }
    }

}

/**
 * Called when a new value on the slider on the Chart tab is set
 * @param slider pointer to the slider
 * @return LV_RES_OK because the slider is not deleted in the function
 */
static lv_res_t slider_action(lv_obj_t * slider)
{
    int16_t v = lv_slider_get_value(slider);
    return LV_RES_OK;
}

/**
 * Called when a a list button is clicked on the List tab
 * @param btn pointer to a list button
 * @return LV_RES_OK because the button is not deleted in the function
 */
static lv_res_t btn_action(lv_obj_t * btn)
{
    return LV_RES_OK;
}

bool LcdPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params);
    state_cfg = &((JsonArray &)params["state"]);

    lvgl_init();
    page_create();

    return true;
}

