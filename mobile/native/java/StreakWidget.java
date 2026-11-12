package com.lightbulb.study;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.widget.RemoteViews;
import org.json.JSONObject;

/** Home-screen widget: streak, next lesson, and a tap to continue. Data comes from the web app
 *  through the Capacitor Preferences plugin (SharedPreferences file "CapacitorStorage", key "widget"). */
public class StreakWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context ctx, AppWidgetManager mgr, int[] ids) {
        for (int id : ids) mgr.updateAppWidget(id, build(ctx));
    }

    static RemoteViews build(Context ctx) {
        RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_streak);
        String streak = "0", subject = "Light Bulb", next = "Open to start today's lesson", done = "";
        try {
            SharedPreferences p = ctx.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
            JSONObject o = new JSONObject(p.getString("widget", "{}"));
            streak = String.valueOf(o.optInt("streak", 0));
            subject = o.optString("subject", subject);
            if (o.optString("next", "").length() > 0) next = o.optString("next");
            done = o.optBoolean("studiedToday", false) ? "Done today ✓" : "Not studied yet today";
        } catch (Exception ignored) {}
        v.setTextViewText(R.id.w_streak, "🔥 " + streak);
        v.setTextViewText(R.id.w_subject, subject + " · " + done);
        v.setTextViewText(R.id.w_next, next);
        Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse("https://amoglightbulb.netlify.app/?go=continue"), ctx, MainActivity.class);
        v.setOnClickPendingIntent(R.id.w_root, PendingIntent.getActivity(ctx, 0, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE));
        return v;
    }

    /** Called by MainActivity when the app goes to the background, so the widget shows fresh data. */
    public static void refresh(Context ctx) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(ctx);
        int[] ids = mgr.getAppWidgetIds(new ComponentName(ctx, StreakWidget.class));
        for (int id : ids) mgr.updateAppWidget(id, build(ctx));
    }
}
