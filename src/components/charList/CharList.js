import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import ErrorMesage from '../errorMesage/ErrorMesage';
import Spinner from '../spinner/Spinner';

import './charList.scss';


class CharList extends Component {
    state = {
        charList: [],
        loaded: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false,
        
    }

    componentDidMount() {
        this.onRequest()
    }

    marvelService = new MarvelService();

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9) {
            ended = true
        }
        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loaded: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }
    onError = () => {
        this.setState({
            loaded: false,
            error: true
        })
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    itemRef = []

    setRef = (ref) => {
        this.itemRef.push(ref);
    }

    setStyleRef = (id) => {
        this.itemRef.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRef[id].classList.add('char__item_selected')
    }    

    renderItems = (arr) => {
        const items = arr.map((item, id) => {
            let imgStyle = {'objectFit': 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'}
            }
            return (
                <li className="char__item"
                    ref={this.setRef}
                    tabIndex={0}
                    key = {item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id)
                        this.setStyleRef(id)
                        }}
                        onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.setStyleRef(id);
                        }
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const {charList, loaded, error, newItemLoading, offset, charEnded} = this.state;

        const item = this.renderItems(charList)

        const errorMesage = error ? <ErrorMesage/>: null;
        const spinner = loaded ? <Spinner/>: null;
        const content = !(error || loaded) ? item: null
        return (
            <div className="char__list">
                {errorMesage}
                {spinner}
                {content}
                <button className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => this.onRequest(offset)}
                style={{'display': charEnded ? 'none': 'block'}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}
export default CharList;