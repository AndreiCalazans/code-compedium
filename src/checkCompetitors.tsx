
import { memo, useEffect } from 'react';
import { Linking, Platform } from 'react-native';

const APP_COMPETITORS = [
  {
    name: 'Binance',
    iosUrlScheme: 'bnc://',
    androidPackageName: 'com.binance.dev',
  },
  {
    name: 'BinanceUS',
    iosUrlScheme: 'bncus://',
    androidPackageName: 'com.binance.us',
  },
  {
    name: 'Bybit',
    iosUrlScheme: 'bybitapp://',
    androidPackageName: 'com.bybit.app',
  },
  {
    name: 'OKX',
    iosUrlScheme: 'okx://',
    androidPackageName: 'com.okinc.okex.gp',
  },

  {
    name: 'Bitget',
    iosUrlScheme: 'bitget://',
    androidPackageName: 'com.bitget.exchange',
  },
  {
    name: 'Upbit',
    iosUrlScheme: '', // CANNOT FIND URL SCHEME
    androidPackageName: 'com.com.dunamu.exchange.global',
  },
  {
    name: 'MEXC',
    iosUrlScheme: 'mexc://',
    androidPackageName: 'com.mexcpro.client',
  },
  {
    name: 'Kucoin',
    iosUrlScheme: 'kucoin://',
    androidPackageName: 'com.kucoin.app',
  },
  {
    name: 'Kraken',
    iosUrlScheme: 'kraken://',
    androidPackageName: 'com.kraken.app',
  },
  {
    name: 'KrakenPro',
    iosUrlScheme: 'krakenpro://',
    androidPackageName: 'com.kraken.trade',
  },
  {
    name: 'Gate.io',
    iosUrlScheme: 'gateio://',
    androidPackageName: 'com.gateio.gateio',
  },
  {
    name: 'Robinhood',
    iosUrlScheme: 'robinhood://',
    androidPackageName: 'com.robinhood.android',
  },
];

const COMPETITIVE_ANALYSIS_STORE_NAME = 'competitive_analysis';
const COMPETITIVE_ANALYSIS_STORE_KEY = 'competitive_analysis_last_checked';

type CompetitorAppType = (typeof APP_COMPETITORS)[number];

export async function isCompetitorAppInstalled(
  app: CompetitorAppType,
): Promise<boolean> {
  if (Platform.OS === 'ios' && app.iosUrlScheme) {
    return Linking.canOpenURL(app.iosUrlScheme);
  }
  if (Platform.OS === 'android' && app.androidPackageName) {
    return Linking.canOpenURL(app.androidPackageName);
  }
  return false;
}

export const CompetitiveAnalysisContent = memo(
  function CompetitiveAnalysisContent() {
    useEffect(() => {
      const today = new Date();
      const lastCheckedTimestamp = LocalStorageMMKV.getStringItem(
        COMPETITIVE_ANALYSIS_STORE_NAME,
        COMPETITIVE_ANALYSIS_STORE_KEY,
      );
      if (lastCheckedTimestamp) {
        const lastCheckedDate = parse(lastCheckedTimestamp, 'T', today);
        if (isValid(lastCheckedDate)) {
          // If the last checked date is less than one month from now, don't run the competitive analysis
          if (isBefore(today, addMonths(lastCheckedDate, 1))) {
            return;
          }
        }
      }

      // Defer execution to avoid blocking the UI thread during app startup
      requestAnimationFrame(async () => {
        let hasError = false;
        try {
          void (await Promise.all(
            APP_COMPETITORS.map(async (app) => {
              const installed = await isCompetitorAppInstalled(app);

              if (installed) {
                logEvent('competitive_analysis', {
                  action: ActionType.measurement,
                  componentType: ComponentType.unknown,
                  appName: app.name,
                });
              }
            }),
          ));
        } catch {
          // Catch any errors from Promise.all to ensure we still
          // mark the analysis as complete even if some checks fail
          hasError = true;
        } finally {
          // If there was an error, don't mark the analysis as complete
          if (!hasError) {
            // Mark that we've performed this analysis to avoid
            // repeating it in future app sessions
            LocalStorageMMKV.setItem(
              COMPETITIVE_ANALYSIS_STORE_NAME,
              COMPETITIVE_ANALYSIS_STORE_KEY,
              today.getTime().toString(),
            );
          }
        }
      });
    }, []);
    return null;
  },
);

export const CompetitiveAnalysis = memo(function CompetitiveAnalysis() {
  return (
    <Suspense>
      <CompetitiveAnalysisContent />
    </Suspense>
  );
});
