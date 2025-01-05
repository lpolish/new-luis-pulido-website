'use server'

import { Resend } from 'resend'
import { kv } from '@vercel/kv'

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = 'luis@luispulido.com' // Replace with your actual email

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email')

  if (!email || typeof email !== 'string') {
    return { error: 'Email is required' }
  }

  try {
    await resend.emails.send({
      from: 'Luis Pulido <newsletter@luispulido.com>',
      to: [email],
      subject: 'Welcome to my newsletter!',
      html: `
        <h1>Thank you for subscribing!</h1>
        <p>I'll keep you updated with the latest news about my projects and insights.</p>
      `
    })

    return { success: true }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return { error: 'Failed to subscribe. Please try again.' }
  }
}

export async function sendContactMessage(formData: FormData) {
  const email = formData.get('email')
  const name = formData.get('name')
  const intent = formData.get('intent')
  const projectType = formData.get('projectType')
  const learningExperience = formData.get('learningExperience')
  const projectGoal = formData.get('projectGoal')
  const timeline = formData.get('timeline')
  const budget = formData.get('budget')
  const message = formData.get('message')

  if (!email || !name || !intent || !projectType || !message || 
      typeof email !== 'string' || typeof name !== 'string' || 
      typeof intent !== 'string' || typeof projectType !== 'string' || 
      typeof message !== 'string') {
    return { error: 'All fields are required. Please check your submission and try again.' }
  }

  try {
    // Send detailed notification to admin about completed submission
    await resend.emails.send({
      from: 'Contact Form <contact@luispulido.com>',
      to: [ADMIN_EMAIL],
      reply_to: email,
      subject: '✅ Complete Contact Form Submission',
      html: `
        <h1>New Complete Contact Form Submission</h1>
        <p><strong>Status:</strong> Complete</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Intent:</strong> ${intent}</p>
        <p><strong>Project/Learning Type:</strong> ${projectType}</p>
        ${intent === 'learn' ? `<p><strong>Learning Experience:</strong> ${learningExperience}</p>` : ''}
        ${intent === 'project' ? `
          <p><strong>Project Goal:</strong> ${projectGoal}</p>
          <p><strong>Timeline:</strong> ${timeline}</p>
          <p><strong>Budget:</strong> ${budget}</p>
        ` : ''}
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        
        <hr>
        <p><em>This is a complete submission. User has finished the entire wizard process.</em></p>
      `
    })

    // Send thank you email to the user
    let thankYouSubject, thankYouContent;
    if (intent === 'project') {
      thankYouSubject = 'Thank you for your project inquiry';
      thankYouContent = `
        <h1>Thank you for reaching out about your ${projectType} project!</h1>
        <p>I'm excited to learn more about your vision. Here are some resources that might be helpful as you plan your project:</p>
        <ul>
          <li><a href="https://nextjs.org/docs">Next.js Documentation</a> - Learn about the framework I often use for web projects.</li>
          <li><a href="https://vercel.com/templates">Vercel Templates</a> - Explore some starter templates for various types of projects.</li>
          <li><a href="https://www.netlify.com/blog/2020/04/13/learn-how-to-accept-money-on-jamstack-sites-in-38-minutes/">Accepting Payments in Jamstack Sites</a> - If your project involves e-commerce.</li>
        </ul>
        <p>I'll be in touch soon to discuss your project in more detail. In the meantime, feel free to explore these resources!</p>
      `;
    } else {
      thankYouSubject = 'Welcome to Your Web Development Journey!';
      thankYouContent = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Welcome to Your Web Development Journey!</h1>
          
          <p>Hi ${name},</p>
          
          <p>I'm thrilled that you're interested in learning ${projectType} development! Before we dive into resources, I want to share something exciting with you:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #0066cc; margin-top: 0;">🚀 Exclusive Opportunity</h2>
            <p><strong>Master Web Development with AI</strong> - My comprehensive course designed specifically for people looking to build professional websites without prior coding knowledge.</p>
            <p>👉 <a href="https://pulido7.gumroad.com/l/learn-web-development" style="color: #0066cc;">Check out the course here</a></p>
            <p>Learn how to leverage AI tools to build professional websites and applications, even if you're just starting out!</p>
          </div>

          <h2 style="color: #333;">Personalized Learning Path</h2>
          
          <p>Based on your experience level (${learningExperience}), here are some carefully curated resources to support your learning journey:</p>

          <h3 style="color: #0066cc;">🌱 Beginner Resources</h3>
          <ul>
            <li><a href="https://www.frontendmentor.io/">Frontend Mentor</a> - Practice with real-world projects</li>
            <li><a href="https://scrimba.com/">Scrimba</a> - Interactive coding tutorials</li>
            <li><a href="https://www.codecademy.com/">Codecademy</a> - Interactive learning platform</li>
          </ul>

          <h3 style="color: #0066cc;">🌿 Intermediate Resources</h3>
          <ul>
            <li><a href="https://fullstackopen.com/">Full Stack Open</a> - Modern web development</li>
            <li><a href="https://javascript30.com/">JavaScript30</a> - 30 Day Vanilla JS Challenge</li>
            <li><a href="https://ui.dev/">ui.dev</a> - Advanced React patterns</li>
          </ul>

          <h3 style="color: #0066cc;">🌳 Advanced Resources</h3>
          <ul>
            <li><a href="https://kentcdodds.com/blog">Kent C. Dodds Blog</a> - Advanced React patterns</li>
            <li><a href="https://www.patterns.dev/">patterns.dev</a> - Modern web app design patterns</li>
            <li><a href="https://github.com/getify/You-Dont-Know-JS">You Don't Know JS</a> - Deep JavaScript knowledge</li>
          </ul>

          <h3 style="color: #0066cc;">🛠 Modern Tools</h3>
          <ul>
            <li><a href="https://v0.dev">v0.dev</a> - AI-powered component builder</li>
            <li><a href="https://vercel.com/">Vercel</a> - Modern web deployment platform</li>
            <li><a href="https://github.com/features/copilot">GitHub Copilot</a> - AI pair programming</li>
          </ul>

          <p style="margin-top: 30px;">Remember: The key to success in web development is consistent practice and building real projects. Start small, but start today!</p>

          <p>I'll be reaching out personally in the next few days to discuss your goals and help you create a structured learning plan. In the meantime, feel free to explore these resources and don't forget to check out my course - it's specifically designed for people starting their web development journey!</p>

          <p>Best regards,<br>Luis Pulido</p>
          
          <hr style="margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666;">
            P.S. Want to fast-track your learning? <a href="https://pulido7.gumroad.com/l/learn-web-development" style="color: #0066cc;">Get started with my Web Development with AI course</a> today!
          </p>
        </body>
        </html>
      `;
    }

    await resend.emails.send({
      from: 'Luis Pulido <contact@luispulido.com>',
      to: [email],
      subject: thankYouSubject,
      html: thankYouContent
    })

    return { success: true }
  } catch (error) {
    console.error('Contact form error:', error)
    return { error: 'Failed to send message. Please try again.' }
  }
}

export async function savePartialInfo(formData: any) {
  const sessionId = Math.random().toString(36).substring(2, 15)
  await kv.set(`partial_submission:${sessionId}`, JSON.stringify(formData), { ex: 60 * 60 * 24 }) // Expire after 24 hours

  try {
    // Send notification to admin about partial submission
    await resend.emails.send({
      from: 'Contact Form <contact@luispulido.com>',
      to: [ADMIN_EMAIL],
      subject: '⏳ New Partial Contact Form Submission',
      html: `
        <h1>New Partial Contact Form Submission</h1>
        <p><strong>Status:</strong> Partial (In Progress)</p>
        <p><strong>Session ID:</strong> ${sessionId}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        
        <h2>Current Form Data:</h2>
        <pre style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
${JSON.stringify(formData, null, 2)}
        </pre>
        
        <hr>
        <p><em>This is a partial submission. User has not completed the wizard process yet.</em></p>
        <p><em>Data will expire in 24 hours if not completed.</em></p>
      `
    })
  } catch (error) {
    console.error('Error sending partial submission email:', error)
  }
}

