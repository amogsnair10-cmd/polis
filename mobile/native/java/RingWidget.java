package com.lightbulb.study;

import android.content.Context;
import android.widget.RemoteViews;

public class RingWidget extends WidgetBase {
    @Override
    RemoteViews build(Context ctx, Data d, int size) {
        int[] layouts = { R.layout.ring_small, R.layout.ring_strip, R.layout.ring_wide, R.layout.ring_large };
        RemoteViews v = new RemoteViews(ctx.getPackageName(), layouts[size]);
        fill(ctx, v, d, false);
        return v;
    }
}
