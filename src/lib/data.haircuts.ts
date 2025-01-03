


  
// after testing exampleImage upload on cloudinary, we can add the exampleImage to the haircutGalleryPrompts

import { HaircutGalleryPrompt } from "src/interfaces/main.interface";

export const haircutGalleryPrompts: HaircutGalleryPrompt[] = [
  {
    type: 'bald',
    itemToReplace:
      "I need to change the haircut of the person in the photo but don't change anything except hair",
    replaceWith:
      'Make the person in the photo bald by removing only their hair keeping all other facial details such as skin texture tone and facial expression exactly as shown in the original Ensure the bald head looks smooth realistic and naturally blended with the face Make the bald head visually appealing and evenly textured for a polished look',
    exampleImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF-ts8ef0ULc3wXS7uMqNbMbMl0sspMzxObsJIL8tobMq1h3LyZ1GMjyUTSfljpiiiRJs&usqp=CAU',
    sex: 'male',
  },
  {
    type: 'buzz',
    itemToReplace:
      "I need to change the haircut of the person in the photo but don't change anything except hair",
    replaceWith:
      'Make the person in the photo have a buzz cut by trimming the hair very short all over the head keeping all other facial details such as skin texture tone and facial expression exactly as shown in the original Ensure the buzz cut looks clean and even for a neat appearance',
    exampleImage:
      'https://menshaircuts.com/wp-content/uploads/2023/10/buzz-cut-types-guide-short-tapered-bald-fade-683x1024.jpg',
    sex: 'male',
  },
  {
    type: 'crew',
    itemToReplace:
      "I need to change the haircut of the person in the photo but don't change anything except hair",
    replaceWith: 'make crew cut shaved sides and 2 cm of hair above',
    exampleImage:
      'https://storage.googleapis.com/postcrafts-public-content/hairstyleai/blog/549edd52-ff15-408d-80b1-a88e15d2bc99.jpg',
    sex: 'male',
  },
  {
    type: 'fade',
    itemToReplace:
      "I need to change the haircut of the person in the photo but don't change anything except hair",
    replaceWith:
      'Make the person in the photo have a fade haircut by trimming the hair very short on the sides and back and gradually increasing the length towards the top keeping all other facial details such as skin texture tone and facial expression exactly as shown in the original Ensure the fade haircut looks clean and even for a neat appearance',
    exampleImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_FflWswTCQqbbiuk4PJaL1_73k4VwSrSHYA&s',
    sex: 'male',
  },
  {
    type: 'undercut',
    itemToReplace:
      "I need to change the haircut of the person in the photo but don't change anything except hair",
    replaceWith:
      'An undercut men’s haircut is a short to medium-length style in which the top contrasts with the sides The hair is left long on the top while the sides  and often the back  are buzzed short This creates a distinction between the top and sides The undercut is especially popular as it’s a timeless look that exudes class and sophistication There are many variations of the undercut hairstyle but the main takeaway is long top and buzzed sides Men with diamond-shaped or square faces tend to look best with this type of hairstyle as it makes the face look less angular',
    exampleImage:
      'https://media.thefashionisto.com/wp-content/uploads/2024/01/Comb-Over-Undercut-Hairstyle.jpg',
    sex: 'male',
  },
  {
    type: 'sidepart',
    itemToReplace:
      "I need to change the haircut of the person in the photo but don't change anything except hair",
    replaceWith: 'side part man haircut',
    exampleImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh8Prnp0gNTAOwFXk-dN7hyC9wjJ7DUAKHnA&s',
    sex: 'male',
  },
  {
    type: 'manbun',
    itemToReplace:
      "I need to change the haircut of the person in the photo but don't change anything except hair",
    replaceWith: 'manbun',
    exampleImage:
      'https://i.pinimg.com/736x/aa/35/27/aa3527663360f770da0fc43b202511ac.jpg',
    sex: 'male',
  },
  {
    type: 'pompadour',
    itemToReplace:
      "I need to change the haircut of the person in the photo but don't change anything except hair",
    replaceWith: 'pompadour',
    exampleImage:
      'https://cdn.shopify.com/s/files/1/0639/1237/8602/files/Classic_Pompadour_2_480x480.jpg?v=1704257558',
    sex: 'male',
  },
];

  