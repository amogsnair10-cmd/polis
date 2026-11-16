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
import android.view.View;
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
 * Shared code for the four Light Bulb widgets (Bento, Ledger, Poster, Ring).
 * Each widget picks one of four layouts by size: SMALL (2x2), STRIP (4x1), WIDE (4x2), LARGE (4x4).
 * Data is written by the web app (Capacitor Preferences, SharedPreferences "CapacitorStorage", key "widget").
 * fill() sets every known view id; ids a layout does not contain are skipped by RemoteViews.
 */
public abstract class WidgetBase extends AppWidgetProvider {
    static final int SMALL = 0, STRIP = 1, WIDE = 2, LARGE = 3;

    static class Data {
        int streak = 0, chapterDone = 0, chapterTotal = 0, nsubs = 0, totalDays = 0;
        boolean today = false;
        boolean[] week = new boolean[7];
        String[] letters = new String[7];
        String subject = "Light Bulb", sid = "psir", next = "Open the app to start", chapter = "", subsLine = "";
        String[] names = new String[3];
        int[] streaks = new int[3];
        int accent = Color.parseColor("#F2C46D");
    }

    static final SimpleDateFormat DAY = new SimpleDateFormat("yyyy-MM-dd", Locale.US);

    static Data load(Context ctx) {
        Data d = new Data();
        for (int i = 0; i < 3; i++) { d.names[i] = ""; d.letters[i] = ""; }
        try {
            SharedPreferences p = ctx.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
            JSONObject o = new JSONObject(p.getString("widget", "{}"));
            d.subject = o.optString("subject", d.subject);
            d.sid = o.optString("sid", "");
            if (d.sid.length() == 0) d.sid = sidFor(d.subject);
            if (o.optString("next", "").length() > 0) d.next = o.optString("next");
            d.chapter = o.optString("chapter", "");
            d.chapterTotal = o.optInt("chapterTotal", 0);
            d.chapterDone = Math.max(0, d.chapterTotal - o.optInt("chapterLeft", 0));
            try { d.accent = Color.parseColor(o.optString("accent", "#F2C46D")); } catch (Exception ignored) {}
            JSONArray sj = o.optJSONArray("subjects");
            StringBuilder line = new StringBuilder();
            if (sj != null) {
                for (int i = 0; i < sj.length() && i < 3; i++) {
                    JSONObject x = sj.optJSONObject(i);
                    if (x == null) continue;
                    d.names[i] = x.optString("t", "");
                    d.streaks[i] = x.optInt("streak", 0);
                    d.nsubs = i + 1;
                    if (line.length() > 0) line.append("  ·  ");
                    line.append(d.names[i]).append(" 🔥").append(d.streaks[i]);
                }
            }
            d.subsLine = line.toString();
            Set<String> days = new HashSet<>();
            JSONArray a = o.optJSONArray("days");
            if (a != null) for (int i = 0; i < a.length(); i++) days.add(a.optString(i));
            Calendar c = Calendar.getInstance();
            d.totalDays = days.size();
            d.today = days.contains(DAY.format(c.getTime()));
            Calendar w = Calendar.getInstance();
            w.add(Calendar.DAY_OF_YEAR, -6);
            for (int i = 0; i < 7; i++) {
                d.week[i] = days.contains(DAY.format(w.getTime()));
                d.letters[i] = "SMTWTFS".substring(w.get(Calendar.DAY_OF_WEEK) - 1, w.get(Calendar.DAY_OF_WEEK));
                w.add(Calendar.DAY_OF_YEAR, 1);
            }
            Calendar s = Calendar.getInstance();
            if (!d.today) s.add(Calendar.DAY_OF_YEAR, -1);
            int n = 0;
            while (days.contains(DAY.format(s.getTime()))) { n++; s.add(Calendar.DAY_OF_YEAR, -1); }
            d.streak = n;
        } catch (Exception ignored) {}
        return d;
    }

    /** Older app copies did not send the subject id: work it out from the subject's name. */
    static String sidFor(String name) {
        String n = name == null ? "" : name.toLowerCase(Locale.ROOT);
        switch (n) {
            case "polis": return "psir";
            case "chronicle": return "history";
            case "terra": return "geography";
            case "verdant": return "environment";
            case "odyssey": return "world";
            case "manifesto": return "communism";
            case "stellar": return "astronomy";
            case "principia": return "physics";
            case "alchemy": return "chemistry";
            case "vita": return "biology";
            case "quanta": return "quantum";
            default: return "psir";
        }
    }

    static PendingIntent open(Context ctx) {
        Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse("https://lightbulb.amogbuilds.net/?go=continue"), ctx, MainActivity.class);
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        return PendingIntent.getActivity(ctx, 0, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    static String status(Data d) { return d.today ? "Studied today ✓" : (d.streak > 0 ? "Study today to keep it" : "Not started today"); }

    static final int[] DOTS = { R.id.w_d0, R.id.w_d1, R.id.w_d2, R.id.w_d3, R.id.w_d4, R.id.w_d5, R.id.w_d6 };
    static final int[] LETS = { R.id.w_l0, R.id.w_l1, R.id.w_l2, R.id.w_l3, R.id.w_l4, R.id.w_l5, R.id.w_l6 };
    static final int[] ROWS = { R.id.w_r1, R.id.w_r2, R.id.w_r3 };
    static final int[] NAMES = { R.id.w_n1, R.id.w_n2, R.id.w_n3 };
    static final int[] STRK = { R.id.w_s1, R.id.w_s2, R.id.w_s3 };
    static final int[] BARS = { R.id.w_p1, R.id.w_p2, R.id.w_p3 };

    /** Fills every view the layouts may contain. light = parchment theme (dark text, bronze accents). */
    static void fill(Context ctx, RemoteViews v, Data d, boolean light) {
        int on = light ? Color.parseColor("#9A6F1C") : d.accent;
        int off = light ? Color.parseColor("#CFC5AE") : Color.parseColor("#33FFFFFF");
        v.setTextViewText(R.id.w_streak, String.valueOf(d.streak));
        if (!light) v.setTextColor(R.id.w_streak, d.accent);
        v.setTextViewText(R.id.w_pill, "🔥 " + d.streak);
        v.setTextViewText(R.id.w_label, status(d));
        v.setTextViewText(R.id.w_cap, "UP NEXT · " + d.subject.toUpperCase(Locale.ROOT));
        v.setTextViewText(R.id.w_subject, d.subject);
        v.setTextViewText(R.id.w_next, d.next);
        v.setTextViewText(R.id.w_subsline, d.subsLine);
        v.setTextViewText(R.id.w_chapter, d.chapter.length() > 0 ? d.chapter : status(d));
        v.setTextViewText(R.id.w_cnt, d.chapterTotal > 0 ? d.chapterDone + "/" + d.chapterTotal : "");
        v.setProgressBar(R.id.w_prog, Math.max(1, d.chapterTotal), d.chapterDone, false);
        int pct = d.chapterTotal > 0 ? (d.chapterDone * 100 / d.chapterTotal) : 0;
        v.setProgressBar(R.id.w_ring, 100, Math.max(pct, 3), false);
        int weekCount = 0;
        for (int i = 0; i < 7; i++) {
            if (d.week[i]) weekCount++;
            v.setTextColor(DOTS[i], d.week[i] ? on : off);
            v.setTextViewText(LETS[i], d.letters[i]);
        }
        v.setTextViewText(R.id.w_weektxt, weekCount + " of 7 days");
        int max = 1;
        for (int i = 0; i < 3; i++) max = Math.max(max, d.streaks[i]);
        for (int i = 0; i < 3; i++) {
            boolean has = i < d.nsubs;
            v.setViewVisibility(ROWS[i], has ? View.VISIBLE : View.GONE);
            if (has) {
                v.setTextViewText(NAMES[i], d.names[i]);
                v.setTextViewText(STRK[i], light ? String.valueOf(d.streaks[i]) : "🔥 " + d.streaks[i]);
                v.setProgressBar(BARS[i], max, d.streaks[i], false);
            }
        }
        int res = ctx.getResources().getIdentifier("hero_" + d.sid, "drawable", ctx.getPackageName());
        if (res == 0) res = ctx.getResources().getIdentifier("hero_psir", "drawable", ctx.getPackageName());
        if (res != 0) v.setImageViewResource(R.id.w_hero, res);
        // Inspector Lumen: the pose follows the streak (kept, at risk after 6 pm, lost, or neutral).
        String lk;
        int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        if (d.today) lk = "lumen_kept";
        else if (d.streak > 0) lk = hour >= 18 ? "lumen_risk" : "lumen_neutral";
        else lk = d.totalDays > 0 ? "lumen_lost" : "lumen_neutral";
        int lres = ctx.getResources().getIdentifier(lk, "drawable", ctx.getPackageName());
        if (lres != 0) v.setImageViewResource(R.id.w_lumen, lres);
        PendingIntent pi = open(ctx);
        v.setOnClickPendingIntent(R.id.w_root, pi);
        v.setOnClickPendingIntent(R.id.w_btn, pi);
    }

    abstract RemoteViews build(Context ctx, Data d, int size);

    void update(Context ctx, AppWidgetManager mgr, int id) {
        Data d = load(ctx);
        if (Build.VERSION.SDK_INT >= 31) {
            Map<SizeF, RemoteViews> m = new HashMap<>();
            m.put(new SizeF(40f, 40f), build(ctx, d, SMALL));
            m.put(new SizeF(220f, 40f), build(ctx, d, STRIP));
            m.put(new SizeF(220f, 110f), build(ctx, d, WIDE));
            m.put(new SizeF(220f, 220f), build(ctx, d, LARGE));
            mgr.updateAppWidget(id, new RemoteViews(m));
        } else {
            Bundle o = mgr.getAppWidgetOptions(id);
            int w = o.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 110);
            int h = o.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 110);
            int size = (w >= 220 && h >= 220) ? LARGE : (w >= 220 && h >= 100) ? WIDE : (w >= 220) ? STRIP : SMALL;
            mgr.updateAppWidget(id, build(ctx, d, size));
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

    void refreshMine(Context ctx) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(ctx);
        for (int id : mgr.getAppWidgetIds(new ComponentName(ctx, getClass()))) update(ctx, mgr, id);
    }
}
