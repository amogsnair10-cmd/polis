# Runs in CI after `npx cap add android`: adds the widget, its manifest entry, and a widget refresh on pause.
import os,re,shutil,glob
A='android/app/src/main'
pkg=os.path.join(A,'java/com/lightbulb/study')
for jf in glob.glob('native/java/*.java'):shutil.copy(jf,pkg)
for f in glob.glob('native/res/*/*'):
    d=os.path.join(A,'res',os.path.basename(os.path.dirname(f)));os.makedirs(d,exist_ok=True);shutil.copy(f,d)
m=open(os.path.join(A,'AndroidManifest.xml')).read()
WIDGETS=[('BentoWidget','bento','Light Bulb · Bento'),('LedgerWidget','ledger','Light Bulb · Ledger'),('PosterWidget','poster','Light Bulb · Poster'),('RingWidget','ring','Light Bulb · Ring')]
rec=''.join(f'''        <receiver android:name=".{c}" android:label="{lab}" android:exported="false">
            <intent-filter><action android:name="android.appwidget.action.APPWIDGET_UPDATE"/></intent-filter>
            <meta-data android:name="android.appwidget.provider" android:resource="@xml/widget_info_{k}"/>
        </receiver>
''' for c,k,lab in WIDGETS)+'    </application>'
if 'BentoWidget' not in m:m=m.replace('    </application>',rec,1)
link='''            <intent-filter>
                <action android:name="android.intent.action.VIEW"/>
                <category android:name="android.intent.category.DEFAULT"/>
                <category android:name="android.intent.category.BROWSABLE"/>
                <data android:scheme="lightbulb"/>
            </intent-filter>
        </activity>'''
if 'android:scheme="lightbulb"' not in m:m=m.replace('        </activity>',link,1)
open(os.path.join(A,'AndroidManifest.xml'),'w').write(m)
ma=os.path.join(pkg,'MainActivity.java');s=open(ma).read()
if 'onPause' not in s:
    s=s.replace('public class MainActivity extends BridgeActivity {}','''public class MainActivity extends BridgeActivity {
    @Override
    public void onPause() { super.onPause(); Widgets.refreshAll(this); }
}''')
open(ma,'w').write(s)
print('patched',s[:300])
