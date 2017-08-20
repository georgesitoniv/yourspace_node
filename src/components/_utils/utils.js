import { notification } from 'antd';

export function notifyUser(message, description){
  notification.open({message, description});
}