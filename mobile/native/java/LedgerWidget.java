package com.lightbulb.study;

import android.content.Context;
import android.widget.RemoteViews;

public class LedgerWidget extends WidgetBase {
    @Override
    RemoteViews build(Context ctx, Data d, int size) {
        int[] layouts = { R.layout.ledger_small, R.layout.ledger_strip, R.layout.ledger_wide, R.layout.ledger_large };
        RemoteViews v = new RemoteViews(ctx.getPackageName(), layouts[size]);
        fill(ctx, v, d, true);
        return v;
    }
}
