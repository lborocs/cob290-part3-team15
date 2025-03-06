import { useLocation } from 'react-router-dom';
      
//This is the boilerplate stuff
function PageDoesNotExist(){
    const location = useLocation();

    return(
        <>
            <div className="d-flex flex-column justify-content-center bs-body-bg">
                <h1 className="">Error 404</h1>
                <p>The target destination "{location.pathname}" does not exist</p>
            </div>
        </>
    )
}
      
export default PageDoesNotExist;