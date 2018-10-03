import { Container } from "unstated";

class ChannelContainer extends Container {
  state = {
    blocks: undefined,
    currentblocknumber: undefined,
    channelid: undefined,
    currentBlockData: undefined,
    error: undefined
  };

  setError = async error => await this.setState({ error });

  resetChannelId = async () => await this.setState({ channelid: undefined });

  setNumberOfBlocks = async numberOfBlocks =>
    await this.setState({ blocks: numberOfBlocks });

  setCurrentBlockNumber = async currentBlockNumber =>
    await this.setState({ currentblocknumber: currentBlockNumber });

  setCurrentBlockData = async currentBlockData =>
    await this.setState({ currentBlockData });

  setChannelInfo = async ({ blocks, currentblocknumber = 0, channelid }) =>
    await this.setState({
      blocks,
      currentblocknumber,
      channelid
    });
}

export default ChannelContainer;
