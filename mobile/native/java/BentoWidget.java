package com.lightbulb.study;

import android.content.Context;
import android.widget.RemoteViews;

public class BentoWidget extends WidgetBase {
    @Override
    RemoteViews build(Context ctx, Data d, int size) {
        int[] layouts = { R.layout.bento_small, R.layout.bento_strip, R.layout.bento_wide, R.layout.bento_large };
        RemoteViews v = new RemoteViews(ctx.getPackageName(), layouts[size]);
        fill(ctx, v, d, false);
        return v;
    }
}
