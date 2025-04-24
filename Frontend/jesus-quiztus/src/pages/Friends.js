import { useUser } from "../context/UserContext";
import UserSearch from "../components/UserSearch";


export default function Friends() {
    const { displayName } = useUser();
    const { session } = useUser();
    
    if (!session) {
        return (
            <div>
                <h1>Please log in to see your friends.</h1>
            </div>
        );
    }

    return (
        <div>
            <h1>Friends Page</h1>
            <p>Name: {displayName}!</p>
            <p>Här kommer massa coola vänner</p>
            <UserSearch />
        </div>
    );

}
