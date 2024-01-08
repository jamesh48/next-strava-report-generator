import {
  setPopupModalDetails,
  setModalState,
  setSortCondition,
  setSportCondition,
  setDateCondition,
  // setFromDateQuery,
  // setToDateQuery,
  appSlice,
  getDateCondition,
  getSortCondition,
  appInitialState,
  getSportCondition,
  getPopupModalDetails,
  getModalState,
} from '@redux/slices/appSlice';

describe('appSlice reducers', () => {
  it('should handle setPopupModalDetails', () => {
    const nextState = appSlice.reducer(
      appInitialState,
      setPopupModalDetails({
        title: 'New Title',
        body: 'New Body',
        severity: 'success',
      })
    );

    expect(nextState.popupModalDetails.title).toEqual('New Title');
    expect(nextState.popupModalDetails.body).toEqual('New Body');
    expect(nextState.popupModalDetails.severity).toEqual('success');
  });

  it('should handle setModalState', () => {
    const nextState = appSlice.reducer(appInitialState, setModalState('open'));
    expect(nextState.popupModalDetails.state).toEqual('open');
  });

  it('should handle setSportCondition', () => {
    const nextState = appSlice.reducer(
      appInitialState,
      setSportCondition('Swim')
    );
    expect(nextState.sportCondition).toEqual('Swim');
  });

  it('should handle setSortCondition', () => {
    const nextState = appSlice.reducer(
      appInitialState,
      setSortCondition('dateDesc')
    );
    expect(nextState.sortCondition).toEqual('dateDesc');
  });
});

describe('appSlice selectors', () => {
  it('should select popUpModalDetails from state', () => {
    // @ts-expect-errorts-ignore
    const result = getPopupModalDetails({ app: appInitialState });
    expect(result).toEqual({
      body: '',
      severity: 'success',
      state: 'closed',
      title: '',
    });
  });

  it('should select sortCondition from the state', () => {
    // @ts-expect-errorts-ignore
    const result = getSortCondition({ app: appInitialState });

    expect(result).toEqual('speedDesc');
  });

  it('should select sportCondition from the state', () => {
    // @ts-expect-errorts-ignore
    const result = getSportCondition({ app: appInitialState });
    expect(result).toEqual('Run');
  });

  it('should select modalState from the state', () => {
    // @ts-expect-errorts-ignore
    const result = getModalState({ app: appInitialState });
    expect(result).toEqual('closed');
  });
});

describe('getDateCondition selector', () => {
  it('should calculate date condition based on state', () => {
    // @ts-expect-error
    const result = getDateCondition({ app: appInitialState });

    expect(result).toEqual(['', '', 'allTime']);
  });

  it('should calculate date condition based on state (year)', () => {
    // @ts-expect-error
    const result = getDateCondition({
      app: { ...appInitialState, dateCondition: 'thisYear' },
    });

    expect(result).toEqual(['2024-01-01', '', 'thisYear']);
  });

  it('should calculate date condition based on state (month)', () => {
    // @ts-expect-error
    const result = getDateCondition({
      app: { ...appInitialState, dateCondition: 'thisMonth' },
    });

    expect(result).toEqual(['2024-01-01', '', 'thisMonth']);
  });

  it('should calculate date condition based on state (week)', () => {
    // @ts-expect-error
    const result = getDateCondition({
      app: { ...appInitialState, dateCondition: 'thisWeek' },
    });

    expect(result).toEqual(['2024-01-08', '', 'thisWeek']);
  });

  it('should handle setDateCondition', () => {
    const nextState = appSlice.reducer(
      appInitialState,
      setDateCondition('thisMonth')
    );
    expect(nextState.customDateCondition).toBeFalsy();
    expect(nextState.dateCondition).toEqual('thisMonth');
  });
});
