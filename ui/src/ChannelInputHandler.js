import React from "react";
import axios from "axios";
import { config } from "./Config.js";
import { Subscribe } from "unstated";
import ChannelContainer from "./ChannelContainer.js";

class ChannelInputHandler extends React.Component {
  state = { channelid: "", error: undefined };

  handleInputChange = ev => {
    const target = ev.target;
    this.setState({ [target.name]: target.value, error: undefined });
  };

  handleSubmit = async ev => {
    ev.preventDefault();
    const { resetChannelId, setChannelInfo, setError } = this.props;

    const { channelid } = this.state;

    try {
      const res = await axios({
        // using axios directly to avoid redirect interceptor
        method: "post",
        url: "/blockinfo",
        baseURL: config.apiserver,
        data: { channelid }
      });

      if (res.data && res.data !== "") {
        setChannelInfo({
          blocks: res.data.height.low - 1,
          currentblocknumber: res.data.height.low - 1,
          channelid: this.state.channelid
        });
      } else {
        setError("Channel not found... please try another.");
        alert('Channel Not Found');
       // resetChannelId();
      }
    } catch (error) {
      setError(error);
      console.log("ERROR " + error);
    }
  };

  render() {
    const { error } = this.state;

    return this.props.children({
      handleInputChange: this.handleInputChange,
      handleSubmit: this.handleSubmit,
      error
    });
  }
}

const ChannelInputHandlerWithState = props => (
  <Subscribe to={[ChannelContainer]}>
    {({ setChannelInfo, resetChannelId, setError, state: { channelid } }) => (
      <ChannelInputHandler
        {...{ setChannelInfo, resetChannelId, channelid, setError }}
        {...props}
      />
    )}
  </Subscribe>
);

export default ChannelInputHandlerWithState;
