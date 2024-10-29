interface StarRatingProps {
    rating: number
}
const StarRating = ({ rating }: StarRatingProps) => {
    return (
        <div className="flex space-x-1 pt-2">
            {[...Array(5)].map((_, index) => (
                <span key={index} className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-400'}`}>
                    ★
                </span>
            ))}
        </div>
    )
}
export default StarRating