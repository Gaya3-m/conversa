import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { capitalize } from "../lib/utils.js";
import { MapPinIcon, MessageSquareIcon } from "lucide-react";

const FriendCard = ({ friend }) => {
    return (
        <div className="card bg-base-200 hover:shadow-lg transition-all duration-300">
        <div className="card-body p-5 space-y-4">
            {/* Avatar + Info */}
            <div className="flex items-center gap-3">
            <div className="avatar">
                <div className="w-16 rounded-full">
                <img src={friend.profilePic} alt={friend.fullName} />
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-lg">{friend.fullName}</h3>
                {friend.location && (
                <div className="flex items-center text-xs opacity-70 mt-1">
                    <MapPinIcon className="size-3 mr-1" />
                    {friend.location}
                </div>
                )}
            </div>
            </div>

            {/* Languages */}
            <div className="flex flex-wrap gap-1.5">
            <span className="badge badge-secondary">
                {getLanguageFlag(friend.nativeLanguage)}
                Native: {capitalize(friend.nativeLanguage)}
            </span>
            <span className="badge badge-outline">
                {getLanguageFlag(friend.learningLanguage)}
                Learning: {capitalize(friend.learningLanguage)}
            </span>
            </div>

            {/* Message button */}
            <Link
            to={`/chat/${friend._id}`}
            className="btn btn-outline w-full mt-2"
            >
            <MessageSquareIcon className="size-4 mr-2" />
            Message
            </Link>
        </div>
        </div>
    );
};

export default FriendCard;

export function getLanguageFlag(language) {
    if (!language) return null;
    const langLower = language.toLowerCase();
    const countryCode = LANGUAGE_TO_FLAG[langLower];

    if (countryCode) {
        return (
        <img
            src={`https://flagcdn.com/24x18/${countryCode}.png`}
            alt={`${langLower} flag`}
            className="h-3 mr-1 inline-block"
        />
        );
    }
    return null;
}
