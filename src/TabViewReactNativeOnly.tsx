import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

function useOnUpdated(cb: () => void, dependency: unknown) {
  const last = useRef<unknown | undefined>(undefined);

  if (dependency !== last.current) {
    last.current = dependency;
    cb();
  }
}

export type RenderTabBar = (tabBarProps: {
  onPress: TabViewProps['onIndexChange'];
  navigationState: {
    index: number;
    routes: TabViewProps['routes'];
  };
}) => void;

export type TabRoute = { key: string; title?: string };
export type TabViewProps = {
  width?: number;
  onSwipeStart?: ScrollViewProps['onScrollBeginDrag'];
  onSwipeEnd?: ScrollViewProps['onScrollEndDrag'];
  onIndexChange: (index: number) => void;
  index: number;
  lazy?: boolean;
  renderTabBar?: RenderTabBar;
  renderScene: (props: {
    route: TabRoute;
    activeIndex: number;
  }) => React.ReactNode;
  routes: TabRoute[];
};

function useLazyLoadingLogic(index: number, width: number, lazy: boolean) {
  const [renderedIndexes, setRenderedIndex] = useState([index]);

  const isTabLazyRendered = useCallback(
    (idx: number) => !renderedIndexes.includes(idx),
    [renderedIndexes],
  );

  useOnUpdated(() => {
    if (isTabLazyRendered(index)) {
      setRenderedIndex((indexes) => [...indexes, index]);
    }
  }, index);

  /*
   * "Peaked" here means a tab was factionally seeing and thus we should mount that tab
   * if it is lazily loaded else we will only mount the tab once a full navigation
   * migration happens.
   *
   * */
  const handlePeakedLazyTab = useCallback(
    (offset: number) => {
      if (!lazy) {
        return;
      }

      const movingIndex = (offset + width) / width - 1;
      const peakedIndex = movingIndex > index ? index + 1 : index - 1;
      if (isTabLazyRendered(peakedIndex)) {
        setRenderedIndex((indexes) => [...indexes, peakedIndex]);
      }
    },
    [index, setRenderedIndex, lazy, width, isTabLazyRendered],
  );

  return {
    handlePeakedLazyTab,
    isTabLazyRendered,
  };
}

export function TabView({
  width = Dimensions.get('screen').width,
  onSwipeStart,
  onSwipeEnd,
  onIndexChange,
  index,
  lazy = false,
  renderScene,
  renderTabBar,
  routes,
}: TabViewProps) {
  const scrollRef = useRef<ScrollView>(null);
  const previousSelectedOffset = useRef(0);
  const offsetX = useRef(index * width);
  const { handlePeakedLazyTab, isTabLazyRendered } = useLazyLoadingLogic(
    index,
    width,
    lazy,
  );

  const handleOnTabIndexChange = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      // We ignore negative values bc it messes up the index update logic.
      offsetX.current = Math.max(event.nativeEvent.contentOffset.x, 0);
      const currentIndex = Math.round(offsetX.current / width);
      const selectedOffset = index * width;
      const movingOffset = currentIndex * width;
      handlePeakedLazyTab(offsetX.current);
      // The following guard is to ignore scroll when it's done by the scrollTo call
      // in useOnUpdated
      if (
        previousSelectedOffset.current !== selectedOffset &&
        selectedOffset !== movingOffset
      ) {
        return;
      }
      previousSelectedOffset.current = selectedOffset;
      const resultingIndex = currentIndex;
      if (selectedOffset !== movingOffset) {
        onIndexChange?.(resultingIndex);
      }
    },
    [onIndexChange, width, index, handlePeakedLazyTab],
  );

  /*
   * The sole purpose of useOnUpdated is to move the scroll position
   * when the index updates from the outside.
   * */
  useOnUpdated(() => {
    /*
     * Math.trunc is required specially when width is a number with many decimals
     * will cause the offsetX.current to not always match.
     *
     * We also consider snap point when there is less than 0.1 diff.
     * */
    const isAtSnapPoint =
      (Math.trunc(offsetX.current) / Math.trunc(width)) % 1 <= 0.1;

    const selectedSnapPoint = index * width;
    const isCurrentlyOutOfPlace = offsetX.current !== selectedSnapPoint;
    /*
     * We need to check if it is at a snap point bc it means the position
     * was changed through the tab bar.
     * */
    if (scrollRef.current && isAtSnapPoint && isCurrentlyOutOfPlace) {
      scrollRef.current.scrollTo({
        x: index * width,
        animated: true,
      });
    }
  }, index);

  const memoizedWidth = useMemo(() => ({ width }), [width]);
  const childHeights = useRef(new Map());
  const handleChildOnLayout = useCallback(
    (routeKey: string) =>
      function onLayoutHandler(e: LayoutChangeEvent) {
        return childHeights.current.set(routeKey, e.nativeEvent.layout.height);
      },
    [],
  );

  const children = useMemo(
    () =>
      routes.map((route, routeIndex) => {
        if (lazy && isTabLazyRendered(routeIndex)) {
          const PlaceholderView = (
            <View key={`${route.key}_lazy_wrapper`} style={memoizedWidth} />
          );
          return PlaceholderView;
        }

        const child = renderScene({ route, activeIndex: index });

        return (
          <View key={route.key} style={memoizedWidth}>
            <View onLayout={handleChildOnLayout(route.key)}>{child}</View>
          </View>
        );
      }),
    // index must stay as a dependency for the lazy logic to run
    [
      routes,
      renderScene,
      index,
      memoizedWidth,
      lazy,
      handleChildOnLayout,
      isTabLazyRendered,
    ],
  );

  const tabBar = useMemo(
    () =>
      renderTabBar?.({
        onPress: onIndexChange,
        navigationState: {
          index,
          routes,
        },
      }),
    [index, routes, onIndexChange, renderTabBar],
  );

  const initialContentOffset = useMemo(
    () => ({
      x: index * width,
      y: 0,
    }),
    /**
     * @andrei.calazans we intentionally only want to
     * hold the initial value of width and index on mount. The
     * current React API has no other way of enabling this behavior.
     *
     * Warning, allowing initialContentOffset to update after initial
     * mount causes unexpected bugs with the TabView switching behavior.
     *
     */
    /* eslint-disable-next-line react-hooks/exhaustive-deps  */
    [],
  );

  return (
    <>
      {tabBar}
      <ScrollView
        key="tabView"
        contentOffset={initialContentOffset}
        ref={scrollRef}
        onScroll={handleOnTabIndexChange}
        scrollEventThrottle={16}
        horizontal
        snapToStart
        snapToInterval={width}
        decelerationRate="fast"
        pagingEnabled
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        disableIntervalMomentum
        onScrollBeginDrag={onSwipeStart}
        onScrollEndDrag={onSwipeEnd}
      >
        {children}
      </ScrollView>
    </>
  );
}
