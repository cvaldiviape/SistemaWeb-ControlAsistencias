import { Component } from 'react'
import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { ReactPlugin, withAITracking } from '@microsoft/applicationinsights-react-js'


const reactPlugin = new ReactPlugin();

class Analytics extends Component {
  componentDidMount() {
    const { history } = this.props;
    if (process.env.REACT_APP_INSTRUMENTATIOM_KEY && !window.ai) {
      console.log("We are starting up app insights tracking, with key", process.env.REACT_APP_INSTRUMENTATIOM_KEY)
      window.ai = new ApplicationInsights({
        config: {
          instrumentationKey: process.env.REACT_APP_INSTRUMENTATIOM_KEY,
          loggingLevelConsole: 2,
          enableDebug: true,
          verboseLogging: true,
          maxBatchInterval: 0,
          disableFetchTracking: false,
         extensions: [reactPlugin],
         extensionConfig: {
           [reactPlugin.identifier]: { history }
         }
        }
      });
      window.ai.loadAppInsights();
      window.ai.trackPageView();
    }
  }
  
  render() { return null }
}

export default withAITracking(reactPlugin, Analytics);