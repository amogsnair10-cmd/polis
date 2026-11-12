# Runs in CI after `npx cap add android`: adds the widget, its manifest entry, and a widget refresh on pause.
import os,re,shutil,glob
A='android/app/src/main'
pkg=os.path.join(A,'java/com/lightbulb/study')
shutil.copy('native/java/StreakWidget.java',pkg)
for f in glob.glob('native/res/*/*'):
    d=os.path.join(A,'res',os.path.basename(os.path.dirname(f)));os.makedirs(d,exist_ok=True);shutil.copy(f,d)
m=open(os.path.join(A,'AndroidManifest.xml')).read()
rec='''        <receiver android:name=".StreakWidget" android:exported="false">
            <intent-filter><action android:name="android.appwidget.action.APPWIDGET_UPDATE"/></intent-filter>
            <meta-data android:name="android.appwidget.provider" android:resource="@xml/streak_widget_info"/>
        </receiver>
    </application>'''
if 'StreakWidget' not in m:m=m.replace('    </application>',rec,1)
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
    public void onPause() { super.onPause(); StreakWidget.refresh(this); }
}''')
open(ma,'w').write(s)
print('patched',s[:300])
