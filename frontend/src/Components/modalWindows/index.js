import AddChannelModal from './AddNewChannel.jsx';
import RemoveChannel from './RemoveChannel.jsx';
import RenameChannel from './RenameChannel.jsx';

const modals = {
  add: AddChannelModal,
  delete: RemoveChannel,
  rename: RenameChannel,
};

export default (channelName) => modals[channelName];
