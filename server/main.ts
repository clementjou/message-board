import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import '../imports/api/messages/MessagesMethods';
import '../imports/api/messages/MessagesPublication';
import '../imports/api/users/UsersPublication';

const defaultUsers = [
  {
    username: 'Jean Dupont',
    picture: 'https://joeschmoe.io/api/v1/jean'
  }, {
    username: 'Jane Smith',
    picture: 'https://joeschmoe.io/api/v1/jane'
  }, {
    username: 'Jon Smith',
    picture: 'https://joeschmoe.io/api/v1/jon'
  }
];
const defaultPassword = 'password';
Meteor.startup(() => {
  //Insertion of default users in order to test simply.
  if (defaultUsers?.length) {
    defaultUsers.map((user) => {
      if (!Accounts.findUserByUsername(user.username)) {
        return Accounts.createUser({
          username: user.username,
          profile: { picture: user.picture },
          password: defaultPassword
        });
      };
    });
  }
})

