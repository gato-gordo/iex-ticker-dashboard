import React, { useReducer, useEffect, Reducer } from 'react';
import { ThemeProvider, Grid, useMediaQuery } from "@material-ui/core";
import { theme } from './theme';
import { Header, Main, Sidebar, SelectTicker, SummaryStatsGrid } from './components';
import { stockDataReducer, STOCK_DATA_DEFAULT_STATE, uiStateReducer, UI_DEFAULT_STATE, refDataReducer, REF_DATA_DEFAULT_STATE, companyDataReducer, COMPANY_DATA_DEFAULT_STATE } from './reducers';
import { StockData, UiState, StockDataAction, UiStateAction, RefData, RefDataAction, CompanyData, CompanyDataAction } from './types';
import { hydrateStockData, hydrateRefData, activeTickerAction, symbolsToOptions, hydrateCompanyData } from './functions';
import { DEFAULT_OPTION } from './constants';


function App() {
  const [uiState, dispatchUiState] = useReducer<Reducer<UiState, UiStateAction>>(uiStateReducer, UI_DEFAULT_STATE);
  const [refData, dispatchRefData] = useReducer<Reducer<RefData, RefDataAction>>(refDataReducer, REF_DATA_DEFAULT_STATE)
  const [stockData, dispatchStockData] = useReducer<Reducer<StockData, StockDataAction>>(stockDataReducer, STOCK_DATA_DEFAULT_STATE);
  const [companyData, dispatchCompanyData] = useReducer<Reducer<CompanyData, CompanyDataAction>>(companyDataReducer, COMPANY_DATA_DEFAULT_STATE);

  useEffect(() => {
    hydrateStockData({ uiState, dispatch: dispatchStockData });
    hydrateRefData({ uiState, dispatch: dispatchRefData })
    hydrateCompanyData({ uiState, dispatch: dispatchCompanyData })
  }, [uiState])

  const symbolOptions = symbolsToOptions(refData.tickers)
  const selectedSymbolOption = symbolOptions.find(symbol => symbol.value === uiState.activeTicker) || DEFAULT_OPTION
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <ThemeProvider theme={theme}>
      <Header>
        <SelectTicker selectedSymbolOption={selectedSymbolOption} dispatch={dispatchUiState} action={activeTickerAction} symbolOptions={symbolOptions} />
      </Header>
      <Grid container>
        <Grid item xs={12} md={10} lg={9} xl={8}>
          <SummaryStatsGrid summaryStats={stockData.summaryStats} />
          <Main stockData={stockData} uiState={uiState} dispatchUiState={dispatchUiState} />
        </Grid>
        {
          isDesktop && (
            <Grid item md={2} lg={3} xl={4}>
              <Sidebar companyData={companyData} />
            </Grid>)
        }
      </Grid>
    </ThemeProvider>
  );
}

export default App;
