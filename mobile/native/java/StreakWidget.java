package com.lightbulb.study;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.SizeF;
import android.widget.RemoteViews;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Resizable Light Bulb widget. Picks a layout by size: small (streak), square, wide strip, or large
 * (streak, next lesson, chapter progress, 7-day dots, Continue button).
 * Data is written by the web app via Capacitor Preferences (SharedPreferences "CapacitorStorage", key "widget").
 */
public class StreakWidget extends AppWidgetProvider {

    static class Data {
        int streak = 0, chapterDone = 0, chapterTotal = 0;
        boolean today = false;
        boolean[] week = new boolean[7];
        String subject = "Light Bulb", next = "Open the app to start", chapter = "";
        int accent = Color.parseColor("#F2C46D");
    }

    static final SimpleDateFormat DAY = new SimpleDateFormat("yyyy-MM-dd", Locale.US);

    static Data load(Context ctx) {
        Data d = new Data();
        try {
            SharedPreferences p = ctx.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
            JSONObject o = new JSONObject(p.getString("widget", "{}"));
            d.subject = o.optString("subject", d.subject);
            if (o.optString("next", "").length() > 0) d.next = o.optString("next");
            d.chapter = o.optString("chapter", "");
            d.chapterTotal = o.optInt("chapterTotal", 0);
            d.chapterDone = Math.max(0, d.chapterTotal - o.optInt("chapterLeft", 0));
            try { d.accent = Color.parseColor(o.optString("accent", "#F2C46D")); } catch (Exception ignored) {}
            Set<String> days = new HashSet<>();
            JSONArray a = o.optJSONArray("days");
            if (a != null) for (int i = 0; i < a.length(); i++) days.add(a.optString(i));
            Calendar c = Calendar.getInstance();
            String todayKey = DAY.format(c.getTime());
            d.today = days.contains(todayKey);
            // last 7 days, oldest first
            Calendar w = Calendar.getInstance();
            w.add(Calendar.DAY_OF_YEAR, -6);
            for (int i = 0; i < 7; i++) { d.week[i] = days.contains(DAY.format(w.getTime())); w.add(Calendar.DAY_OF_YEAR, 1); }
            // streak counts back from today (or yesterday if today is not done yet)
            Calendar s = Calendar.getInstance();
            if (!d.today) s.add(Calendar.DAY_OF_YEAR, -1);
            int n = 0;
            while (days.contains(DAY.format(s.getTime()))) { n++; s.add(Calendar.DAY_OF_YEAR, -1); }
            d.streak = n;
        } catch (Exception ignored) {}
        return d;
    }

    static PendingIntent open(Context ctx) {
        Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse("https://amoglightbulb.netlify.app/?go=continue"), ctx, MainActivity.class);
        return PendingIntent.getActivity(ctx, 0, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    static String status(Data d) { return d.today ? "Done today ✓" : (d.streak > 0 ? "Study today to keep it" : "Not started today"); }

    static RemoteViews small(Context ctx, Data d) {
        RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_small);
        v.setTextViewText(R.id.w_streak, String.valueOf(d.streak));
        v.setTextColor(R.id.w_streak, d.accent);
        v.setTextViewText(R.id.w_label, d.streak == 1 ? "day" : "days");
        v.setOnClickPendingIntent(R.id.w_root, open(ctx));
        return v;
    }

    static RemoteViews square(Context ctx, Data d) {
        RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_square);
        v.setTextViewText(R.id.w_streak, "🔥 " + d.streak);
        v.setTextColor(R.id.w_streak, d.accent);
        v.setTextViewText(R.id.w_label, status(d));
        v.setTextViewText(R.id.w_next, d.next);
        v.setTextViewText(R.id.w_subject, d.subject);
        v.setOnClickPendingIntent(R.id.w_root, open(ctx));
        return v;
    }

    static RemoteViews wide(Context ctx, Data d) {
        RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_wide);
        v.setTextViewText(R.id.w_streak, String.valueOf(d.streak));
        v.setTextColor(R.id.w_streak, d.accent);
        v.setTextViewText(R.id.w_label, "day streak");
        v.setTextViewText(R.id.w_next, d.next);
        v.setTextViewText(R.id.w_subject, d.subject + " · " + status(d));
        v.setOnClickPendingIntent(R.id.w_root, open(ctx));
        return v;
    }

    static final int[] DOTS = { R.id.w_d0, R.id.w_d1, R.id.w_d2, R.id.w_d3, R.id.w_d4, R.id.w_d5, R.id.w_d6 };

    static RemoteViews large(Context ctx, Data d) {
        RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_large);
        v.setTextViewText(R.id.w_streak, "🔥 " + d.streak);
        v.setTextColor(R.id.w_streak, d.accent);
        v.setTextViewText(R.id.w_label, d.streak == 1 ? "day streak" : "day streak");
        v.setTextViewText(R.id.w_subject, d.subject);
        v.setTextViewText(R.id.w_next, d.next);
        String ch = d.chapter.length() > 0 ? d.chapter + " · " + d.chapterDone + "/" + d.chapterTotal : status(d);
        v.setTextViewText(R.id.w_chapter, ch);
        v.setProgressBar(R.id.w_prog, Math.max(1, d.chapterTotal), d.chapterDone, false);
        for (int i = 0; i < 7; i++) v.setTextColor(DOTS[i], d.week[i] ? d.accent : Color.parseColor("#33FFFFFF"));
        v.setTextColor(R.id.w_btn, d.accent);
        v.setOnClickPendingIntent(R.id.w_root, open(ctx));
        v.setOnClickPendingIntent(R.id.w_btn, open(ctx));
        return v;
    }

    static void update(Context ctx, AppWidgetManager mgr, int id) {
        Data d = load(ctx);
        if (Build.VERSION.SDK_INT >= 31) {
            Map<SizeF, RemoteViews> m = new HashMap<>();
            m.put(new SizeF(40f, 40f), small(ctx, d));
            m.put(new SizeF(110f, 110f), square(ctx, d));
            m.put(new SizeF(220f, 40f), wide(ctx, d));
            m.put(new SizeF(220f, 150f), large(ctx, d));
            mgr.updateAppWidget(id, new RemoteViews(m));
        } else {
            Bundle o = mgr.getAppWidgetOptions(id);
            int w = o.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 110);
            int h = o.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 110);
            RemoteViews v = (w >= 220 && h >= 150) ? large(ctx, d) : (w >= 220) ? wide(ctx, d) : (h >= 110 && w >= 110) ? square(ctx, d) : small(ctx, d);
            mgr.updateAppWidget(id, v);
        }
    }

    @Override
    public void onUpdate(Context ctx, AppWidgetManager mgr, int[] ids) {
        for (int id : ids) update(ctx, mgr, id);
    }

    @Override
    public void onAppWidgetOptionsChanged(Context ctx, AppWidgetManager mgr, int id, Bundle newOptions) {
        update(ctx, mgr, id);
    }

    /** Called by MainActivity when the app goes to the background, so the widget shows fresh data. */
    public static void refresh(Context ctx) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(ctx);
        for (int id : mgr.getAppWidgetIds(new ComponentName(ctx, StreakWidget.class))) update(ctx, mgr, id);
    }
}
