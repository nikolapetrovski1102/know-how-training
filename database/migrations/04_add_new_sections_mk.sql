-- ============================================================================
-- KnowHow Enhanced Sections - Macedonian (MK)
-- Adds Videos, Coaches, Resources, Testimonials, and FAQ sections
-- ============================================================================

DECLARE @NewSections NVARCHAR(MAX) = N'[
  {
    "Type": "intro-card",
    "Greeting": "<span style=\"font-weight: 600; font-size: 20px; color: #1e293b;\">Здраво! Јас сум вашиот водич</span>",
    "Description": "<span style=\"color: #64748b; line-height: 1.8;\">Професионален тренер фокусиран на тоа да ви помогне да ги постигнете вашите цели преку практично, практично учење</span>",
    "Name": "<span style=\"font-weight: 600;\">Име на Експерт</span>",
    "Title": "<span style=\"font-style: italic; color: #64748b; font-size: 14px;\">Главен & Образовен Директор</span>"
  },
  {
    "Type": "stats",
    "Title": "<span style=\"font-size: 36px; font-weight: 300; color: #1e293b;\">Нашето Влијание</span>",
    "Items": [
      {
        "Value": "<span style=\"font-size: 48px; font-weight: 700; color: #dc2626;\">500+</span>",
        "Label": "<span style=\"font-size: 14px; color: #64748b;\">Обучени Студенти</span>"
      },
      {
        "Value": "<span style=\"font-size: 48px; font-weight: 700; color: #dc2626;\">95%</span>",
        "Label": "<span style=\"font-size: 14px; color: #64748b;\">Стапка на Успех</span>"
      }
    ]
  },
  {
    "Type": "videos",
    "Title": "<span style=\"font-size: 36px; font-weight: 300; color: #1e293b;\">Обучувачки Видеа</span>",
    "Subtitle": "<span style=\"color: #64748b;\">Погледнете ги нашите обучувачки сесии водени од експерти</span>",
    "Items": [
      {
        "Title": "<span style=\"font-weight: 600;\">Вовед во Модерен Развој</span>",
        "Description": "<span style=\"color: #64748b;\">Научете ги основите на современите  практики за развој на софтвер</span>",
        "Url": "https://youtube.com/watch?v=example1",
        "Thumbnail": "/uploads/video-thumb-1.jpg"
      },
      {
        "Title": "<span style=\"font-weight: 600;\">Напредни Техники на Лидерство</span>",
        "Description": "<span style=\"color: #64748b;\">Совладајте ги вештините потребни за водење тимови со високи перформанси</span>",
        "Url": "https://youtube.com/watch?v=example2",
        "Thumbnail": "/uploads/video-thumb-2.jpg"
      }
    ]
  },
  {
    "Type": "coaches",
    "Title": "<span style=\"font-size: 36px; font-weight: 300; color: #1e293b;\">Наши Експертни Тренери</span>",
    "Subtitle": "<span style=\"color: #64748b;\">Учете од индустриски професионалци со реално искуство</span>",
    "Items": [
      {
        "Name": "<span style=\"font-weight: 600;\">Јован Смит</span>",
        "Title": "<span style=\"color: #dc2626; font-weight: 500;\">Старши Технички Тренер</span>",
        "Bio": "<span style=\"color: #64748b;\">15+ години искуство во програмирање и техничка обука. Специјализиран во модерни веб технологии и облак архитектура.</span>",
        "Image": "/uploads/coach-john.jpg",
        "Expertise": "<span style=\"color: #64748b; font-size: 12px;\">React, Node.js, Облак Архитектура</span>"
      },
      {
        "Name": "<span style=\"font-weight: 600;\">Сара Џонсон</span>",
        "Title": "<span style=\"color: #dc2626; font-weight: 500;\">Коуч за Лидерство</span>",
        "Bio": "<span style=\"color: #64748b;\">Извршен коуч со 20+ години помагање на лидери да ги трансформираат нивните тимови. Поранешен CTO во Fortune 500 компанија.</span>",
        "Image": "/uploads/coach-sarah.jpg",
        "Expertise": "<span style=\"color: #64748b; font-size: 12px;\">Извршно Лидерство, Управување со Тим</span>"
      }
    ]
  },
  {
    "Type": "resources",
    "Title": "<span style=\"font-size: 36px; font-weight: 300; color: #1e293b;\">Ресурси за Учење</span>",
    "Subtitle": "<span style=\"color: #64748b;\">Преземете ги нашите сеопфатни обучувачки материјали</span>",
    "Items": [
      {
        "Title": "<span style=\"font-weight: 600;\">Комплетен Водич за Развој</span>",
        "Description": "<span style=\"color: #64748b; font-size: 14px;\">Сеопфатен водич од 50 страни покривање модерни развојни практики</span>",
        "FileUrl": "/uploads/resources/dev-guide.pdf",
        "FileType": "PDF"
      },
      {
        "Title": "<span style=\"font-weight: 600;\">Работна Книга за Лидерство</span>",
        "Description": "<span style=\"color: #64748b; font-size: 14px;\">Практични вежби и шаблони за ефективно лидерство</span>",
        "FileUrl": "/uploads/resources/leadership-workbook.pdf",
        "FileType": "PDF"
      }
    ]
  },
  {
    "Type": "testimonials",
    "Title": "<span style=\"font-size: 36px; font-weight: 300; color: #1e293b;\">Приказни за Успех</span>",
    "Subtitle": "<span style=\"color: #64748b;\">Што нашите студенти кажуваат за нивното искуство</span>",
    "Items": [
      {
        "Quote": "<span style=\"color: #1e293b; font-style: italic;\">\"Оваа обука целосно го трансформираше мојот пристап кон лидерство. Практичните вештини што ги научив биле неценети во мојата кариера.\"</span>",
        "Author": "<span style=\"font-weight: 600;\">Михаел Чен</span>",
        "Role": "<span style=\"color: #64748b;\">Менаџер за Софтверско Инженерство</span>",
        "Company": "<span style=\"color: #94a3b8;\">Тех Корпорација</span>",
        "Image": "/uploads/testimonial-michael.jpg"
      },
      {
        "Quote": "<span style=\"color: #1e293b; font-style: italic;\">\"Извонредна програма! Практичниот пристап и експертната инструкција направија целата разлика.\"</span>",
        "Author": "<span style=\"font-weight: 600;\">Ема Родригез</span>",
        "Role": "<span style=\"color: #64748b;\">Менаџер за Производ</span>",
        "Company": "<span style=\"color: #94a3b8;\">Иновација ДОО</span>",
        "Image": "/uploads/testimonial-emma.jpg"
      }
    ]
  },
  {
    "Type": "faq",
    "Title": "<span style=\"font-size: 36px; font-weight: 300; color: #1e293b;\">Често Поставувани Прашања</span>",
    "Subtitle": "<span style=\"color: #64748b;\">Сè што треба да знаете за нашите обучувачки програми</span>",
    "Items": [
      {
        "Question": "<span style=\"font-weight: 500;\">Колку трае обучувачката програма?</span>",
        "Answer": "<span style=\"color: #64748b;\">Повеќето од нашите програми траат од 16 до 24 часа, испорачани во текот на неколку недели за да се овозможи практикување и примена на нови вештини.</span>"
      },
      {
        "Question": "<span style=\"font-weight: 500;\">Дали нудите приспособена обука за тимови?</span>",
        "Answer": "<span style=\"color: #64748b;\">Да! Специјализирани сме во создавање обучувачки програми прилагодени кои се справуваат со специфичните потреби и предизвици на вашата организација.</span>"
      },
      {
        "Question": "<span style=\"font-weight: 500;\">Што е вклучено во таксата за обука?</span>",
        "Answer": "<span style=\"color: #64748b;\">Сите материјали, ресурси, континуирана поддршка и сертификат по завршување. Исто така, обезбедуваме следни сесии по обуката.</span>"
      }
    ]
  },
  {
    "Type": "featured-programs",
    "Title": "<span style=\"font-size: 36px; font-weight: 300; color: #1e293b;\">Издвоени Обучувачки Програми</span>",
    "Subtitle": "<span style=\"color: #64748b;\">Истражете ги нашите  најпопуларни курсеви за професионален развој</span>"
  }
]';

-- Update the Pages table
UPDATE PageContent
SET ContentSection = @NewSections
WHERE PageId = 1 AND LanguageId = 2

PRINT 'Macedonian (MK) sections updated with Videos, Coaches, Resources, Testimonials, and FAQ!';
