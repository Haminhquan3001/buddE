"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StarRating from '@/components/Rating'

const testimonials = [
  {
    name: "Johnny D.",
    avatar: 'A',
    title: "Web Developer",
    rating: 4,
    description: "Impressive tool with a lot of useful information. The AI feels quite intuitive, though there were a few times it missed some context. Overall, a fantastic career resource!",
  },
  {
    name: "Alex K.",
    avatar: 'A',
    title: "Marketing Specialist",
    rating: 5,
    description: "I love how this chatbot personalizes advice based on my inputs. It's like having a mentor on demand. Easy to use and very reliable!",
  },
  {
    name: "Tom R.",
    avatar: 'A',
    title: 'Software Engineer',
    rating: 5,
    description: "This chatbot is a lifesaver for quick career advice! The responses are spot-on and very informative. Highly recommended for anyone looking to boost their career path!",
  },
  {
    name: "Maria S.",
    avatar: 'A',
    title: "Graphic Designer",
    rating: 4,
    description: "Great for on-the-go career questions. The chatbot is quick and mostly accurate, though I’d love to see more depth in some responses. Definitely a helpful tool overall!",
  }
]

const LandingContent = () => {
  return (
    <div className='px-10 pb-20'>
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        Customer Reviews
      </h2>
      <div className="grid grid-col-1 
      sm:grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4">
        {testimonials.map((item) => (
          <Card key={item.description} className='bg-[#192339] border-none text-white'>
            <CardHeader>
              <CardTitle className='flex items-center gap-x-2'>
                <div>
                  <p className='text-lg text-zinc-50'>{item.name}</p>
                  <p className='text-zinc-500 text-sm'>{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className='pt-4 px-0 text-slate-300'>
                {item.description}
                <StarRating rating={item.rating} />
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default LandingContent