import { useEffect, useState } from 'react';

import { DEFAULT_SETTINGS, type Settings, getSettings, updateSettings } from '~/lib/settings';

type SettingsAppProps = {
  mode: 'popup' | 'options';
};

type SettingKey = keyof Settings;

const SETTING_LABELS: Record<SettingKey, { title: string; description: string }> = {
  enabled: {
    title: 'Enable extension',
    description: 'Advance to the next YouTube watch tab when the current video finishes.'
  },
  closeCurrentTab: {
    title: 'Close current tab',
    description: 'Close the finished tab after the next tab becomes active.'
  }
};

export function SettingsApp({ mode }: SettingsAppProps) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    void getSettings().then((nextSettings) => {
      if (!isMounted) {
        return;
      }

      setSettings(nextSettings);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleToggle(key: SettingKey, checked: boolean) {
    const nextSettings = await updateSettings({ [key]: checked });
    setSettings(nextSettings);
  }

  return (
    <main className={mode === 'popup' ? 'min-w-80 bg-stone-950' : 'min-h-screen bg-stone-950'}>
      <section className="relative overflow-hidden text-stone-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(234,179,8,0.24),_transparent_40%),linear-gradient(135deg,_rgba(41,37,36,0.95),_rgba(12,10,9,1))]" />
        <div className="relative space-y-6 p-5">
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300/80">Youtube Tab Playlist</p>
            <h1 className="text-2xl font-semibold leading-tight text-stone-50">
              {mode === 'popup' ? 'Quick controls' : 'Extension settings'}
            </h1>
            <p className="max-w-md text-sm leading-6 text-stone-300">
              Keep your YouTube watch tabs moving in tab order with typed, synced settings.
            </p>
          </header>

          <div className="space-y-3">
            {(Object.keys(SETTING_LABELS) as SettingKey[]).map((key) => {
              const label = SETTING_LABELS[key];

              return (
                <label
                  key={key}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-stone-100">{label.title}</div>
                    <div className="text-sm leading-5 text-stone-400">{label.description}</div>
                  </div>

                  <span className="relative mt-1 inline-flex shrink-0 items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={settings[key]}
                      disabled={isLoading}
                      onChange={(event) => {
                        void handleToggle(key, event.target.checked);
                      }}
                    />
                    <span className="h-6 w-11 rounded-full bg-stone-700 transition peer-checked:bg-amber-400 peer-disabled:opacity-60" />
                    <span className="pointer-events-none absolute left-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}