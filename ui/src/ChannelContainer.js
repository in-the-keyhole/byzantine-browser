import { Container } from "unstated";

class ChannelContainer extends Container {
  state = {
    blocks: undefined,
    currentblocknumber: undefined,
    channelid: undefined
  };

  resetChannelId = async () => {
    await this.setState({ channelid: undefined });
  };

  setNumberOfBlocks = async numberOfBlocks =>
    await this.setState({ blocks: numberOfBlocks });

  setCurrentBlockNumber = async currentBlockNumber =>
    await this.setState({ currentblocknumber: currentBlockNumber });

  setChannelInfo = async ({ blocks, currentblocknumber = 0, channelid }) => {
    console.log("setting channel info", {
      blocks,
      currentblocknumber,
      channelid
    });
    await this.setState({
      blocks,
      currentblocknumber,
      channelid
    });
  };
}

export default ChannelContainer;
