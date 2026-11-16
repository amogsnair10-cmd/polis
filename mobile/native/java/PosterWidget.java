package com.lightbulb.study;

import android.content.Context;
import android.widget.RemoteViews;

public class PosterWidget extends WidgetBase {
    @Override
    RemoteViews build(Context ctx, Data d, int size) {
        int[] layouts = { R.layout.poster_small, R.layout.poster_strip, R.layout.poster_wide, R.layout.poster_large };
        RemoteViews v = new RemoteViews(ctx.getPackageName(), layouts[size]);
        fill(ctx, v, d, false);
        return v;
    }
}
