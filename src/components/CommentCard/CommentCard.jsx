import styles from "./CommentCard.module.css";

export default function CommentCard({ comment }) {
  return (
    <div className={styles.card}>
      <p>Comment</p>
    </div>
  );
}

// {
//   "id": "0c17d514-68d9-4efa-af8b-c78da55bf88b",
//   "userId": 1,
//   "postId": "57c20dfb-8135-42eb-8abe-0bffbaffd668",
//   "content": "Comment 11",
//   "likes": 0,
//   "createdAt": "2025-05-03T03:45:44.579Z",
//   "updatedAt": "2025-05-03T03:45:44.579Z",
//   "User": {
//       "id": 1,
//       "firstName": "Bodi",
//       "lastName": "Ali",
//       "Profile": {
//           "profileImgUrl": "https://res.cloudinary.com/dgfglascb/image/upload/v1745107077/mrcja3i0xdylkidvxy3e.png"
//       }
//   },
//   "commentLiked": false
// }
