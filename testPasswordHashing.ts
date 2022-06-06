import * as User from './models/user';

User.hashPassword('myPlainPassword')
    .then((hashedPassword : string) => {
        console.log(hashedPassword);
        }
     );

User.verifyPassword(
    'myWrongPlainPassword',
    '$argon2id$v=19$m=65536,t=5,p=1$6F4WFjpSx9bSq9k4lp2fiQ$cjVgCHF/voka5bZI9YAainiaT+LkaQxfNN638b/h4fQ'
    ).then((passwordIsCorrect : boolean) => {
         console.log(passwordIsCorrect);
       }
    );