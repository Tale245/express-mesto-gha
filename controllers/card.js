const Сard = require('../models/card');

const {
  NOT__FOUND_ERROR, STATUS__OK,
} = require('../constants/constants');

const NotFoundError = require('../Error/NotFoundError');
const ForbiddenError = require('../Error/ForbiddenError');
const BadRequestError = require('../Error/BadRequestError');

module.exports.getCards = (req, res, next) => {
  Сard
    .find({})
    .populate(['owner', 'likes'])
    .then((data) => {
      res.status(STATUS__OK).send(data);
    })
    .catch((e) => {
      next(e);
    });
};

module.exports.createCard = async (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  const card = await Сard.create({ name, link, owner });
  card
    .populate('owner')
    .then((data) => {
      res.status(STATUS__OK).send(data);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Переданые некорректные данные'));
      } else {
        next(e);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Сard.findById(req.params.id)
    .populate('owner')
    .orFail(() => {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    })
    .then((data) => {
      if (data.owner.id !== req.user._id) {
        throw new ForbiddenError('Отказано в доступе');
      } else {
        Сard.findByIdAndRemove(data.id)
          .then(() => res.status(STATUS__OK).send(data))
          .catch((e) => {
            next(e);
          });
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(e);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Сard
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .populate(['likes', 'owner'])
    .orFail(() => {
      throw new NotFoundError('Передан невалидный id пользователя');
    })
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (e.statusCode === NOT__FOUND_ERROR) {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
      } else {
        next(e);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Сard
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new NotFoundError('Передан невалидный id пользователя');
    })
    .populate(['likes', 'owner'])
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (e.statusCode === NOT__FOUND_ERROR) {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
      } else {
        next(e);
      }
    });
};
