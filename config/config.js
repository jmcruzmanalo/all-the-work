const t = {
  DEVELOPMENT_NO_BOT: 'DEVELOPMENT_NO_BOT',
  DEVELOPMENT_WITH_BOT: 'DEVELOPMENT_WITH_BOT'
};

const env = process.env.NODE_ENV || 'DEVELOPMENT_NO_BOT';

switch (env) {
  case t[DEVELOPMENT_NO_BOT]:
    break;

  case t[DEVELOPMENT_WITH_BOT]:
    break;
}
