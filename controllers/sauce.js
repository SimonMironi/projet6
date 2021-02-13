const Sauce = require('../models/Sauce');
const sanitize = require('mongo-sanitize');

exports.getSauces = (req, res) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.getSauce = (req, res) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            console.log(error)
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.createSauce = (req, res, next) => {
    const sauceObj = sanitize(JSON.parse(req.body.sauce));
    const sauce = new Sauce({
        ...sauceObj,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        
    });
    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'La sauce à bien été ajoutée'
            });
        }
    ).catch(
        (error) => {
            console.log(error);
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res) => {
    const sauceObj = req.file ? {
        ...sanitize(JSON.parse(req.body.sauce)),                                                  
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({_id: req.params.id}, { ...sauceObj, _id: req.params.id })
    .then(() => {
            res.status(201).json({
                message: 'La sauce à bien été modifiée'
            });
        }
    ).catch((error) => {
            res.status(400).json({
                error: error
            });
        }
    )
};

exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id }).then(
      () => {
        res.status(200).json({
          message: 'Sauce supprimée !'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

exports.sauceReview = (req, res) => {
    Sauce.findOne({ _id: req.params.id })

    .then(sauce => {

        if (req.body.like === -1 && !sauce.usersDisliked.includes(req.body.userId)){
            Sauce.updateOne({ _id: req.params.id }, {          
                $inc: {dislikes:1},                             
                $push: {usersDisliked: req.body.userId},        
                _id: req.params.id
            })
            .then(() => res.status(201).json({ message: 'Dislike ajouté !'}))
            .catch( error => res.status(400).json({ error }))

        }

        else if (req.body.like === 0){

            if (sauce.usersLiked.includes(req.body.userId)) {     
                console.log(req.body)
                Sauce.updateOne({ _id : req.params.id }, {                     
                    $inc: {likes:-1},                                          
                    $pull: {userLiked: req.body.userId},                      
                    _id: req.params.id
                })
                .then(() => res.status(201).json({message: 'Like retiré !'}))
                .catch( error => res.status(400).json({ error: error }))
            }

            if (sauce.usersDisliked.includes(req.body.userId)) {  
                console.log(req.body.like)
                Sauce.updateOne({ _id : req.params.id }, {                     
                    $inc: { dislikes:-1 },                                       
                    $pull: { userDisliked: req.body.userId },                   
                    _id: req.params.id
                })
                .then(() => res.status(201).json({message: 'Dislike retiré !'}))
                .catch( error => res.status(400).json({ error }));
            }

        }

        else{

            Sauce.updateOne({ _id: req.params.id }, {                          
                $inc: { likes:1 },                                              
                $push: { usersLiked: req.body.userId },                         
                _id: req.params.id
            })
            .then(() => res.status(201).json({ message: 'Like ajouté !'}))
            .catch( error => res.status(400).json({ error }));
        }
    })
    .catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
    );
}
