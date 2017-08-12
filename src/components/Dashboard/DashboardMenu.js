import React from 'react';
import { Menu, notification } from 'antd';

const MenuItem = Menu.Item;

export default (props) => {
  const { handleClick, selectedKeys } = props;
  return(
    <div>
      <Menu 
        theme="dark"
        onClick={handleClick}
        selectedKeys={[selectedKeys]}
        mode="horizontal"
        style={{ lineHeight: '64px' }}>
        <MenuItem key="chats">
          All Chats
        </MenuItem>
        <MenuItem key="friends">
          Friends
        </MenuItem>
        <MenuItem key="users">
          Users
        </MenuItem>
        <MenuItem key="signout">
          Sign Out
        </MenuItem>
      </Menu>
    </div>
  );
}
// class DashboardMenu extends React.Component{
//   render(){
//     const { handleClick, selectedKeys } = this.props;
//     return(
//       <div>
//         <Menu 
//           onClick={handleClick}
//           selectedKeys={[selectedKeys]}
//           mode="inline">
//           <MenuItem key="chats">
//             All Chats
//           </MenuItem>
//           <MenuItem key="friends">
//             Friends
//           </MenuItem>
//           <MenuItem key="users">
//             Users
//           </MenuItem>
//           <MenuItem key="signout">
//             Sign Out
//           </MenuItem>
//         </Menu>
//       </div>
//     );
//   }
// }

// export default DashboardMenu;