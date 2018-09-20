import { Container } from "unstated";

class ChannelContainer extends Container {
  state = {
    blocks: undefined,
    currentblocknumber: undefined,
    channelid: undefined
  };

  resetChannelId = () => {
    this.setState({ channelid: undefined });
  };
  setChannelInfo = ({ blocks, currentblocknumber, channelid }) => {
    this.setState({
      blocks,
      currentblocknumber,
      channelid
    });
  };
}

export default ChannelContainer;
