import {
  setPopupModalDetails,
  // setModalState,
  setSortCondition,
  // setSportCondition,
  // setDateCondition,
  // setFromDateQuery,
  // setToDateQuery,
  appSlice,
  getDateCondition,
  getSortCondition,
  appInitialState,
  // getSportCondition,
  // getPopupModalDetails,
  // getModalState,
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

  it('should handle setSortCondition', () => {
    const nextState = appSlice.reducer(
      appInitialState,
      setSortCondition('dateDesc')
    );
    expect(nextState.sortCondition).toEqual('dateDesc');
  });
});

describe('appSlice selectors', () => {
  it('should select sortCondition from the state', () => {
    // @ts-expect-errorts-ignore
    const result = getSortCondition({ app: appInitialState });

    expect(result).toEqual('speedDesc');
  });
});

describe('getDateCondition selector', () => {
  it('should calculate date condition based on state', () => {
    // @ts-expect-error
    const result = getDateCondition({ app: appInitialState });

    expect(result).toEqual(['', '', 'allTime']);
  });
});
