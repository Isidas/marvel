import { Component } from "react";
import ErrorMesage from "../errorMesage/ErrorMesage";

class ErrorBoundary extends Component {

    state = {
        error: false
    }

    componentDidCatch() {
        this.setState({error: true})
    }

    render() {
        if(this.state.error){
            return(
                <ErrorMesage/>
            )
        }
        return(
            this.props.children
        )
    }
}
export default ErrorBoundary;
