-- ============================================================================
-- KnowHow Enhanced Sections - English (EN)
-- Adds Videos, Coaches, Resources, Testimonials, and FAQ sections
-- ============================================================================
-- Parse existing sections and add new ones
DECLARE @NewSections NVARCHAR(MAX) = N'[
  {
    "Type": "intro-card",
    "Greeting": "<span style=\"font-weight: 600; font-size: 20px; color: #1e293b;\">Hello! I''m your guide</span>",
    "Description": "<span style=\"color: #64748b; line-height: 1.8;\">Professional trainer focused on helping you achieve your goals through practical, hands-on learning</span>",
    "Name": "<span style=\"font-weight: 600;\">Expert Name</span>",
    "Title": "<span style=\"font-style: italic; color: #64748b; font-size: 14px;\">Principal & Educational Director</span>"
  },
  {
    "Type": "stats",
    "Title": "<span style=\"font-size: 36px; font-weight: 300; color: #1e293b;\">Our Impact</span>",
    "Items": [
      {
        "Value": "<span style=\"font-size: 48px; font-weight: 700; color: #dc2626;\">500+</span>",
        "Label": "<span style=\"font-size: 14px; color: #64748b;\">Students Trained</span>"
      },
      {
        "Value": "<span style=\"font-size: 48px; font-weight: 700; color: #dc2626;\">95%</span>",
        "Label": "<span style=\"font-size: 14px; color: #64748b;\">Success Rate</span>"
      }
    ]
  },
  {
    "Type": "videos",
    "Title": "<span style=\"font-size: 36px; font-weight: 300; color: #1e293b;\">Training Videos</span>",
    "Subtitle": "<span style=\"color: #64748b;\">Watch our expert-led training sessions</span>",
    "Items": [
      {
        "Title": "<span style=\"font-weight: 600;\">Introduction to Modern Development</span>",
        "Description": "<span style=\"color: #64748b;\">Learn the fundamentals of contemporary software development practices</span>",
        "Url": "https://youtube.com/watch?v=example1",
        "Thumbnail": "/uploads/video-thumb-1.jpg"
      },
      {
        "Title": "<span style=\"font-weight: 600;\">Advanced Leadership Techniques</span>",
        "Description": "<span style=\"color: #64748b;\">Master the skills needed to lead high-performing teams</span>",
        "Url": "https://youtube.com/watch?v=example2",
        "Thumbnail": "/uploads/video-thumb-2.jpg"
      }
    ]
  },
  {
    "Type": "coaches",
    "Title": "<span style=\"font-size: 36px; font-weight: 300; color: #1e293b;\">Our Expert Trainers</span>",
    "Subtitle": "<span style=\"color: #64748b;\">Learn from industry professionals with real-world experience</span>",
    "Items": [
      {
        "Name": "<span style=\"font-weight: 600;\">John Smith</span>",
        "Title": "<span style=\"color: #dc2626; font-weight: 500;\">Senior Technical Trainer</span>",
        "Bio": "<span style=\"color: #64748b;\">15+ years of experience in software development and technical training. Specialized in modern web technologies and cloud architecture.</span>",
        "Image": "/uploads/coach-john.jpg",
        "Expertise": "<span style=\"color: #64748b; font-size: 12px;\">React, Node.js, Cloud Architecture</span>"
      },
      {
        "Name": "<span style=\"font-weight: 600;\">Sarah Johnson</span>",
        "Title": "<span style=\"color: #dc2626; font-weight: 500;\">Leadership Coach</span>",
        "Bio": "<span style=\"color: #64748b;\">Executive coach with 20+ years helping leaders transform their teams. Former CTO at Fortune 500 company.</span>",
        "Image": "/uploads/coach-sarah.jpg",
        "Expertise": "<span style=\"color: #64748b; font-size: 12px;\">Executive Leadership, Team Management</span>"
      }
    ]
  },
  {
    "Type": "resources",
    "Title": "<span style=\"font-size: 36px; font-weight: 300; color: #1e293b;\">Learning Resources</span>",
    "Subtitle": "<span style=\"color: #64748b;\">Download our comprehensive training materials</span>",
    "Items": [
      {
        "Title": "<span style=\"font-weight: 600;\">Complete Development Guide</span>",
        "Description": "<span style=\"color: #64748b; font-size: 14px;\">Comprehensive 50-page guide covering modern development practices</span>",
        "FileUrl": "/uploads/resources/dev-guide.pdf",
        "FileType": "PDF"
      },
      {
        "Title": "<span style=\"font-weight: 600;\">Leadership Workbook</span>",
        "Description": "<span style=\"color: #64748b; font-size: 14px;\">Practical exercises and templates for effective leadership</span>",
        "FileUrl": "/uploads/resources/leadership-workbook.pdf",
        "FileType": "PDF"
      }
    ]
  },
  {
    "Type": "testimonials",
    "Title": "<span style=\"font-size: 36px; font-weight: 300; color: #1e293b;\">Success Stories</span>",
    "Subtitle": "<span style=\"color: #64748b;\">What our students say about their experience</span>",
    "Items": [
      {
        "Quote": "<span style=\"color: #1e293b; font-style: italic;\">\"This training completely transformed my approach to leadership. The practical skills I learned have been invaluable in my career.\"</span>",
        "Author": "<span style=\"font-weight: 600;\">Michael Chen</span>",
        "Role": "<span style=\"color: #64748b;\">Software Engineering Manager</span>",
        "Company": "<span style=\"color: #94a3b8;\">Tech Corporation</span>",
        "Image": "/uploads/testimonial-michael.jpg"
      },
      {
        "Quote": "<span style=\"color: #1e293b; font-style: italic;\">\"Outstanding program! The hands-on approach and expert instruction made all the difference.\"</span>",
        "Author": "<span style=\"font-weight: 600;\">Emma Rodriguez</span>",
        "Role": "<span style=\"color: #64748b;\">Product Manager</span>",
        "Company": "<span style=\"color: #94a3b8;\">Innovation Inc</span>",
        "Image": "/uploads/testimonial-emma.jpg"
      }
    ]
  },
  {
    "Type": "faq",
    "Title": "  <span style=\"font-size: 36px; font-weight: 300; color: #1e293b;\">Frequently Asked Questions</span>",
    "Subtitle": "<span style=\"color: #64748b;\">Everything you need to know about our training programs</span>",
    "Items": [
      {
        "Question": "<span style=\"font-weight: 500;\">What is the duration of the training programs?</span>",
        "Answer": "<span style=\"color: #64748b;\">Most of our programs range from 16 to 24 hours, delivered over several weeks to allow for practice and application of new skills.</span>"
      },
      {
        "Question": "<span style=\"font-weight: 500;\">Do you offer customized training for teams?</span>",
        "Answer": "<span style=\"color: #64748b;\">Yes! We specialize in creating tailored training programs that address your organization''s specific needs and challenges.</span>"
      },
      {
        "Question": "<span style=\"font-weight: 500;\">What is included in the training fee?</span>",
        "Answer": "<span style=\"color: #64748b;\">All materials, resources, ongoing support, and certification upon completion. We also provide post-training follow-up sessions.</span>"
      }
    ]
  },
  {
    "Type": "featured-programs",
    "Title": "<span style=\"font-size: 36px; font-weight: 300; color: #1e293b;\">Featured Training Programs</span>",
    "Subtitle": "<span style=\"color: #64748b;\">Explore our most popular professional development courses</span>"
  }
]';

-- Update the Pages table
UPDATE PageContents
SET ContentSection = @NewSections
WHERE PageId = 1 AND LanguageId= 1;

PRINT 'English (EN) sections updated with Videos, Coaches, Resources, Testimonials, and FAQ!';
