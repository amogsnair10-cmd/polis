package com.lightbulb.study;

import android.content.Context;

/** Called by MainActivity when the app goes to the background, so every widget shows fresh data. */
public class Widgets {
    public static void refreshAll(Context ctx) {
        new BentoWidget().refreshMine(ctx);
        new LedgerWidget().refreshMine(ctx);
        new PosterWidget().refreshMine(ctx);
        new RingWidget().refreshMine(ctx);
    }
}
