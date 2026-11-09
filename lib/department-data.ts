/**
 * Official Job Descriptions for URPN Workforce Departments and their Heads.
 * Source: URPN Governing Council & Leadership Guidelines.
 */

export interface ResponsibilityGroup {
  category: string;
  items: string[];
}

export interface HeadOfDepartment {
  title: string;
  summary: string;
  responsibilities: ResponsibilityGroup[];
  kpis: string[];
  qualifications?: string[];
}

export interface DepartmentJobDescription {
  departmentName: string;
  overview: string;
  responsibilities: ResponsibilityGroup[];
  keyAttributes: string[];
  headOfDepartment: HeadOfDepartment;
}

export const DEPARTMENT_JOB_DESCRIPTIONS: Record<string, DepartmentJobDescription> = {
  "aesthetics": {
    "departmentName": "Aesthetics Department",
    "overview": "The Aesthetics Department plays a vital role in creating an environment that is welcoming, inspiring, and conducive for worship, meetings, and events. This team ensures that the event premises reflect a spirit of excellence and orderliness, staying aligned with modern trends and standards.",
    "responsibilities": [
      {
        "category": "Hall Preparation and Maintenance",
        "items": [
          "Maintain a clean, organized, and visually appealing environment for all church services, meetings, and events.",
          "Regularly clean and sanitize meeting locations, ensuring they are ready for use at any time.",
          "Oversee the arrangement of chairs, tables, and other essentials in a manner that promotes comfort, accessibility, and aesthetics."
        ]
      },
      {
        "category": "Design and Decorations",
        "items": [
          "Conceptualize and implement creative designs for the stage (altar) and other event locations.",
          "Update decorations for special occasions (e.g., Easter, Christmas, weddings, conferences) to align with the event's theme and message."
        ]
      },
      {
        "category": "Sustainability and Trends",
        "items": [
          "Incorporate sustainable and eco-friendly practices in designs and decorations (e.g., reusable materials, energy-efficient lighting).",
          "Stay updated on current trends in church aesthetics and interior design, ensuring the space feels modern, welcoming, and inclusive."
        ]
      },
      {
        "category": "Post-Service Cleanup",
        "items": [
          "After each service or event, oversee the proper cleaning and resetting of the hall to ensure readiness for the next use.",
          "Address any damage or maintenance issues promptly, working with the facilities management team."
        ]
      },
      {
        "category": "Special Projects",
        "items": [
          "Collaborate with other departments to create a cohesive look and feel for URPN events and programs."
        ]
      }
    ],
    "keyAttributes": [
      "A keen eye for design and detail.",
      "Creativity and the ability to conceptualise fresh, modern ideas.",
      "Strong teamwork and collaboration skills.",
      "Ability to work under time constraints, especially before major events.",
      "Willingness to learn and adapt to new trends and technologies in aesthetics."
    ],
    "headOfDepartment": {
      "title": "Head of the Aesthetics Department",
      "summary": "The Head of the Aesthetics Department is a leadership role responsible for overseeing the creative design, maintenance, and overall visual appeal of URPN meetings and event environments. This individual will ensure that all spaces reflect a spirit of excellence, align with the church’s vision, and incorporate modern trends in aesthetics. The Head of Department (HOD) will lead the team in creating an atmosphere that inspires worship and enhances the experience of attendees for every Kingdomite, event, and meeting.",
      "responsibilities": [
        {
          "category": "Leadership and Oversight",
          "items": [
            "Provide strategic direction for the Aesthetics Department, ensuring alignment with the church’s vision and goals.",
            "Lead, motivate, and mentor team members to perform their duties effectively and with a spirit of excellence.",
            "Assign tasks to team members and oversee their execution, ensuring deadlines and standards are met."
          ]
        },
        {
          "category": "Design and Innovation",
          "items": [
            "Develop and implement creative, innovative designs for church interiors, including the stage (altar), halls, and other spaces.",
            "Ensure that designs are modern, culturally relevant, and aligned with church themes and special events (e.g., Easter, Christmas, conferences).",
            "Integrate contemporary elements, such as LED lighting, digital backdrops, and multimedia effects, into stage and hall designs where necessary on budget."
          ]
        },
        {
          "category": "Project Management",
          "items": [
            "To plan, coordinate, and execute seasonal or event-based decoration projects, ensuring timely delivery and excellence.",
            "Manage budgets for decorations, materials, and equipment while maintaining cost efficiency and quality.",
            "Work closely with other departments (e.g., Media, Technical) to ensure cohesive aesthetics across all touchpoints."
          ]
        },
        {
          "category": "Operational Excellence",
          "items": [
            "Oversee the cleanliness, organization, and readiness of meeting halls and spaces before and after services or events.",
            "Ensure that the arrangement of furniture, equipment, and decor is functional, visually appealing, and accessible.",
            "Regularly inspect the premises to address maintenance needs or aesthetic improvements.",
            "Design spaces that reflect the church’s values, culture, and mission, creating a lasting positive impression"
          ]
        },
        {
          "category": "Trend Monitoring and Sustainability",
          "items": [
            "Stay updated on global trends in church aesthetics, interior design, and stagecraft to keep the church environment fresh and engaging.",
            "Incorporate sustainable practices and reusable materials in designs and decorations."
          ]
        },
        {
          "category": "Team Development",
          "items": [
            "Train team members on best practices in aesthetics, design, and cleaning protocols.",
            "Foster a collaborative and creative team environment, encouraging innovation and ownership of responsibilities.",
            "Recognize and develop the talents of team members to build a strong and dynamic department."
          ]
        },
        {
          "category": "Reporting and Communication",
          "items": [
            "Provide regular updates to the URPN leadership on projects, budgets, and team performance.",
            "Communicate clearly with other departments to coordinate efforts and ensure smooth collaboration.",
            "Present departmental reports are URPN meetings."
          ]
        }
      ],
      "kpis": [
        "Timely and successful execution of decoration and design projects.",
        "Positive feedback from leadership and congregation on aesthetics and environment.",
        "Effective team collaboration and individual development.",
        "Alignment of designs with the church’s vision and branding.",
        "Adherence to budgets and resource management.",
        "Membership strength and development all round"
      ]
    }
  },
  "pr": {
    "departmentName": "Public Relations Department",
    "overview": "Public Relations Department The Public Relations (PR) Department is the voice and face of the ministry, responsible for ensuring effective communication, follow-ups, branding, and public engagement. This team fosters strong relationships with both the congregation and the community, promoting the ministry's vision and ensuring that all inquiries and engagements are handled with excellence.",
    "responsibilities": [
      {
        "category": "Inquiries and Information Management",
        "items": [
          "Serve as the first point of contact for inquiries about the ministry.",
          "Maintain up-to-date knowledge about the ministry, its vision, schedules, programs, and initiatives to provide accurate responses."
        ]
      },
      {
        "category": "Follow-up and Contact Engagement",
        "items": [
          "Collaborate with the Evangelical Team to follow up on contacts from field evangelism.",
          "Send bulk SMS messages to contacts before and after Kingdomite meetings, ensuring first-timers are encouraged to attend and become integrated into the ministry, Departments, and cells.",
          "Formulate creative strategies to retain participants from tertiary institutions and the local community."
        ]
      },
      {
        "category": "First-Timer Follow-Up",
        "items": [
          "Track and follow up with first-timers after every meeting, ensuring personalized calls and messages are sent to welcome and encourage them to stay connected."
        ]
      },
      {
        "category": "Collaboration with Other Departments",
        "items": [
          "Partner with the Media Department to achieve proper publicity and branding for events and programs.",
          "Work closely with the Counseling Department to schedule meetings and appointments, including those with the President."
        ]
      },
      {
        "category": "Branding and Image Management",
        "items": [
          "Alongside the Media Department, manage and uphold the ministry's branding and public image.",
          "Ensure all communications, events, and visuals align with the ministry’s values and standards."
        ]
      },
      {
        "category": "Ensure all team members are trained and oriented in key areas, including",
        "items": [
          "Ministry details, mission, and vision.",
          "Local territorial intelligence.",
          "Meeting schedules and ministry calendar.",
          "Professional ethics and PR skills.",
          "Effective strategies for managing and retaining souls brought to the ministry.",
          "Discipline and caution in public and private interactions, as representatives of the ministry."
        ]
      },
      {
        "category": "Event Correspondence and Coordination",
        "items": [
          "Handle correspondence and registration processes for all ministry events, ensuring seamless operations.",
          "Manage testimony and first-timer slips at meetings and ensure proper documentation."
        ]
      },
      {
        "category": "Bulk SMS and Communication Management",
        "items": [
          "Oversee the functionality and effectiveness of the bulk SMS system for outreach and notifications.",
          "Work with the Administrator to send monthly encouragement and appreciation messages to the workforce.",
          "Post URPN media resources across all platforms"
        ]
      },
      {
        "category": "Invitations and Scheduling",
        "items": [
          "Manage invitations to the ministry’s President and ensure engagements are well-coordinated."
        ]
      },
      {
        "category": "Manage Félicitations",
        "items": [
          "The team would ensure timely notification and celebration of community members’ special days and anniversaries i.e., birthdays.",
          "Work with the Media Department to make media material for such recognitions."
        ]
      },
      {
        "category": "Additional Duties",
        "items": [
          "Assist with any additional responsibilities as assigned by the Governing Council or Administrator."
        ]
      }
    ],
    "keyAttributes": [
      "Strong communication and interpersonal skills.",
      "A thorough understanding of the ministry’s vision, mission, and core values.",
      "Organizational and multitasking abilities.",
      "A heart for outreach and soul-winning.",
      "Ability to work under pressure and maintain professionalism."
    ],
    "headOfDepartment": {
      "title": "Head of Public Relations Department",
      "summary": "The Head of the Public Relations Department (HOD) serves as the strategic leader responsible for managing the department's operations, ensuring the ministry’s community connection and outreach efforts are upheld with excellence and proactivity. The HOD collaborates with other departments, provides direction to the team, and acts as the main liaison between the PR Department and the Administrator.",
      "responsibilities": [
        {
          "category": "Leadership and Oversight",
          "items": [
            "Oversee the day-to-day operations of the PR department, ensuring all tasks and responsibilities are carried out efficiently.",
            "Motivate, mentor, and guide team members to achieve departmental goals.",
            "Provide periodic performance reports to the Administrator."
          ]
        },
        {
          "category": "Strategic Communication",
          "items": [
            "Develop strategies to enhance the ministry’s communication and engagement with the congregation and external contacts.",
            "Ensure all responses to inquiries are prompt, professional, and aligned with the ministry’s vision."
          ]
        },
        {
          "category": "Follow-up Coordination",
          "items": [
            "To lead the team in executing follow-up activities for evangelism contacts and first-timers, ensuring seamless integration into the ministry.",
            "Partner with the Media Department to ensure effective publicity and branding.",
            "Collaborate with the Evangelical Team and Counseling Department to coordinate activities and follow-ups."
          ]
        },
        {
          "category": "Event Coordination",
          "items": [
            "Manage the PR department’s role in events, including registration, correspondence, and documentation of testimonies and first-timer details."
          ]
        },
        {
          "category": "Communication Systems Management",
          "items": [
            "Ensure the effective functioning of the bulk SMS system, and coordinate the dissemination of messages.",
            "Manage felicitations effectively",
            "Ensure timely postings on social platforms"
          ]
        },
        {
          "category": "Training and Development",
          "items": [
            "Regularly organize training sessions for team members on ministry knowledge, PR skills, and ethical conduct.",
            "Ensure team members are equipped to handle challenges and excel in their roles."
          ]
        },
        {
          "category": "Reporting and Feedback",
          "items": [
            "Provide regular updates to the Administrator and Governing Council on departmental activities and outcomes.",
            "Analyze feedback from follow-ups and outreach efforts to improve processes."
          ]
        },
        {
          "category": "Additional Duties",
          "items": [
            "Undertake any other responsibilities as assigned by the Governing Council or Administrator."
          ]
        }
      ],
      "kpis": [
        "Timeliness and professionalism of responses to inquiries.",
        "Growth in first-timer retention and integration rates.",
        "Positive feedback from leadership, team members, and the congregation.",
        "Consistency and quality of the ministry’s branding and public image.",
        "Efficiency and accuracy in event registrations, correspondence, and follow-ups.",
        "Membership strength and development all round"
      ]
    }
  },
  "protocol": {
    "departmentName": "Protocol Department",
    "overview": "Protocol Department The Protocol Department is responsible for ensuring order, security, and seamless coordination during all ministry events and services. This Department facilitates the smooth movement of individuals, manages ministerial interactions, and works closely with other Departments to maintain an environment of excellence and reverence.",
    "responsibilities": [
      {
        "category": "Order/Movement Management",
        "items": [
          "Oversee and regulate the movement of individuals within the hall during services and events to maintain order and minimize distractions.",
          "Ensure VIP and ministerial movements are discreetly coordinated without interruptions.",
          "Serve as the first line of security within the hall, identifying and addressing any potential disturbances or security threats promptly.",
          "Monitor the congregation to ensure a safe and respectful atmosphere.",
          "Partner with the Ushering Department to organize seating arrangements efficiently, ensuring that all seating protocols are adhered to.",
          "Assist in managing overflow seating when necessary",
          "Provide support for individuals under the influence of the Holy Spirit during ministrations, working closely with ushers to ensure their safety and proper coordination."
        ]
      },
      {
        "category": "Ministerial Support",
        "items": [
          "Act as the official link between ministers’ seating areas and the stage, ensuring smooth transitions during programs.",
          "Manage ministerial needs discreetly, ensuring minimal disturbance to services.",
          "Prevent unnecessary or unauthorized contact with ministers, especially guest ministers, to maintain professionalism and respect."
        ]
      },
      {
        "category": "Additional Duties",
        "items": [
          "Undertake any other responsibilities as assigned by the Governing Council or the URPN Administrator to ensure the smooth running of services."
        ]
      }
    ],
    "keyAttributes": [
      "Disciplined, vigilant, and professional in conduct.",
      "Strong interpersonal and conflict-resolution skills.",
      "A calm demeanour and ability to handle high-pressure situations.",
      "Awareness of the ministry’s vision, mission, and core values.",
      "Physically fit to manage duties requiring movement and attention."
    ],
    "headOfDepartment": {
      "title": "Chief Protocol Officer",
      "summary": "The Chief Protocol Officer (CPO) leads the Protocol Department, ensuring order, safety, and coordination at all URPN events. The CPO serves as the manager of the Department, responsible for training, overseeing operations, and acting as the face of the department to the URPN Administrator.",
      "responsibilities": [
        {
          "category": "Leadership and Oversight",
          "items": [
            "To lead the Protocol Department, ensuring all duties are carried out with professionalism and excellence.",
            "Provide strategic direction and assign roles to team members during services and events.",
            "Act as the primary point of contact between the Protocol Department and the URPN Administrator."
          ]
        },
        {
          "category": "Order and Movement Coordination",
          "items": [
            "Oversee the regulation of movement within the hall during services, ensuring minimal disruptions.",
            "Manage the flow of individuals to and from the ministers’ seats and the stage.",
            "Lead the Department in monitoring security within the hall, identifying and addressing potential issues.",
            "Train team members in security intelligence and crowd management strategies.",
            "Ensure adequate support for ministers during services and events, ensuring their needs are met without causing distractions.",
            "Enforce protocols to limit unnecessary contact with guest ministers and ensure their comfort and safety.",
            "Coordinate the lines to see the ministers and president and another minister in-house."
          ]
        },
        {
          "category": "Training and Development",
          "items": [
            "Train Protocol Department members on professional conduct like security awareness, and effective communication.",
            "Recommend improvements to protocol processes as needed.",
            "Ensure team members understand and uphold the ministry’s vision and values."
          ]
        },
        {
          "category": "Reporting and Feedback",
          "items": [
            "Provide regular updates to the URPN Administrator on the Department's performance and any challenges encountered.",
            "Present report at URPN workers’ meeting."
          ]
        },
        {
          "category": "Additional Duties",
          "items": [
            "Undertake additional responsibilities as assigned by the Governing Council or Administrator to support the smooth running of the ministry’s operations."
          ]
        }
      ],
      "kpis": [
        "Smooth and seamless coordination of all movement and activities during services and events.",
        "Timely and professional execution of duties during special events.",
        "Effective collaboration with other Departments to ensure holistic service excellence",
        "Membership strength and development all round"
      ]
    }
  },
  "ushering": {
    "departmentName": "Ushering Department",
    "overview": "Ushering Department The Ushering Department is the frontline team responsible for creating a welcoming, organized, and serene atmosphere during our services and programs. Ushers ensure that attendees are seated comfortably, materials are distributed efficiently, and the overall flow of the service is smooth. They also play a critical role in coordinating collections, providing information, and addressing the needs of attendees.",
    "responsibilities": [
      {
        "category": "Seating and Movement Coordination",
        "items": [
          "Allocate seating positions for attendees, ensuring orderliness and accessibility during services. Guiding attendees to available seats discreetly, minimizing distractions during ongoing programs.",
          "Oversee the movement of offering baskets during services. Collecting offerings and other donations efficiently and handing them over to the Finance Department promptly.",
          "Manage the distribution of bulletins, programs, and other materials to attendees before or during services;  Ensuring every attendee receives the necessary materials without disruption to the service."
        ]
      },
      {
        "category": "Information and Assistance",
        "items": [
          "Provide basic information to attendees concerning the service or program, ensuring clarity and accessibility.",
          "Address the needs of individuals within the hall, offering guidance and assistance as needed.",
          "Remain alert and attentive to the needs of the congregation, including emergencies, disruptions, or other situations requiring immediate attention.",
          "Collaborate with the Protocol and Security Departments to address issues as they arise."
        ]
      },
      {
        "category": "Additional Responsibilities",
        "items": [
          "Maintain demographic records of attendees at each meeting, providing accurate reports to PR for adequate recording.",
          "Undertake other duties as assigned by the Governing Council or Administrator to support smooth service operations."
        ]
      }
    ],
    "keyAttributes": [
      "Polite, welcoming, and approachable demeanour.",
      "Excellent organisational and multitasking skills.",
      "Ability to maintain focus and professionalism during services.",
      "Attentiveness to the needs of the congregation.",
      "A strong sense of responsibility and accountability"
    ],
    "headOfDepartment": {
      "title": "Chief Usher",
      "summary": "The Chief Usher is the leader and administrator of the Ushering Department, responsible for overseeing all ushering activities during services and events. Reporting to the Administrator, the Chief Usher ensures that the Department operates efficiently and maintains order. This role requires strategic planning, leadership, and effective collaboration with other Departments.",
      "responsibilities": [
        {
          "category": "Leadership and Oversight",
          "items": [
            "Provide leadership, direction, and administrative oversight for the Ushering Department.",
            "Delegate roles and responsibilities to Department members, ensuring all duties are performed effectively.",
            "Act as the primary link between the Ushering Department and the Administrator."
          ]
        },
        {
          "category": "Coordination of Duties",
          "items": [
            "Oversee seating arrangements and the distribution of materials, ensuring all attendees are accommodated.",
            "Supervise the collection of offerings and other donations, ensuring accuracy and security.",
            "Ensure a calm, serene, and welcoming atmosphere in every meeting and event.",
            "Monitor and address disruptions, ensuring that services run smoothly."
          ]
        },
        {
          "category": "Reporting Function",
          "items": [
            "Ensure accurate demographic records are collected at every meeting and submitted to the PR Department for proper documentation.",
            "Provide regular reports on the Department’s performance, challenges, and progress to the Administrator.",
            "Present reports at URPN workers’ meetings."
          ]
        },
        {
          "category": "Training and Development",
          "items": [
            "Organize and lead training sessions to improve ushering skills, professionalism, and service quality..."
          ]
        },
        {
          "category": "Additional Responsibilities",
          "items": [
            "Undertake additional duties as assigned by the Administrator or Governing Council to support the ministry’s operations."
          ]
        }
      ],
      "kpis": [
        "Efficient seating and movement coordination during services.",
        "Timeliness and accuracy in collecting and submitting demographic records and offerings.",
        "Positive feedback from attendees on the welcoming and organized atmosphere.",
        "Active participation in planning, training, and meetings.",
        "Collaboration with other Departments to ensure smooth service operations.",
        "Membership strength and development all round"
      ]
    }
  },
  "technical": {
    "departmentName": "Technical Department",
    "overview": "Technical Department The  Technical Department is responsible for ensuring the smooth operation of all technical aspects during services and events, including sound production, electrical services, and equipment maintenance. The Department plays a critical role in enhancing the worship experience by providing high-quality audio and a reliable power supply. The team is headed by the Head of the  Technical Department (HOD), who oversees the Department’s growth, performance, and alignment with the ministry's vision.",
    "responsibilities": [
      {
        "category": "Power Supply Management",
        "items": [
          "Ensure a steady and reliable supply of electrical power during services, rehearsals, and events.",
          "Monitor power sources to prevent disruptions and provide quick solutions in case of outages."
        ]
      },
      {
        "category": "Sound Production and Engineering",
        "items": [
          "Maintain balanced, clear, and high-quality sound during meetings, rehearsals, and events.",
          "Handle sound mixing to ensure optimal audio output, enhancing the overall experience for attendees.",
          "Set up and test all sound systems at least 1 hour before any meeting begins.",
          "Ensure all engineers are punctual, properly dressed, and ready for operation during services.",
          "Assign sound engineers to monitor and manage the sound mixer throughout the service, ensuring consistency and quality."
        ]
      },
      {
        "category": "Equipment Management",
        "items": [
          "Maintain all technical equipment in excellent condition through regular maintenance and servicing.",
          "Follow the ministry's equipment leasing policy and ensure no equipment is given out without proper authorization."
        ]
      },
      {
        "category": "Training and Skill Development",
        "items": [
          "Provide opportunities for skilled and unskilled members to learn and grow within the Department.",
          "Train unskilled members to become proficient in technical operations within a short period."
        ]
      },
      {
        "category": "Collaboration and Coordination",
        "items": [
          "Work closely with other departments (e.g., Media, Worship) to ensure smooth technical operations during programs.",
          "Assist in setting up technical aspects for special events."
        ]
      },
      {
        "category": "Additional Responsibilities",
        "items": [
          "Undertake other technical or related duties as assigned by the Governing Council or Administrator."
        ]
      }
    ],
    "keyAttributes": [
      "Technical aptitude and attention to detail.",
      "Punctuality, discipline, and readiness to serve.",
      "Willingness to learn and adapt to new technologies and processes.",
      "Strong teamwork and collaboration skills.",
      "Ability to work under pressure and handle unexpected technical challenges."
    ],
    "headOfDepartment": {
      "title": "Head of  Technical Department (HOD)",
      "summary": "The Head of the  Technical Department (HOD) provides strategic leadership and oversight for the  Technical Department. This individual ensures all technical operations are conducted efficiently, from power supply to sound production and equipment maintenance. Reporting to the Administrator, the HOD is responsible for the Department’s growth, training, and alignment with the ministry's mission and standards.",
      "responsibilities": [
        {
          "category": "Leadership and Oversight",
          "items": [
            "Provide leadership and direction to the  Technical Department, ensuring all responsibilities are executed effectively.",
            "Assign roles to team members and monitor their performance during services and events.",
            "Act as the primary liaison between the  Technical Department and the Administrator.",
            "Enforce compliance with ministry policies, including the equipment leasing policy.",
            "Assign sub-department leadership roles where necessary"
          ]
        },
        {
          "category": "Power and Sound Management",
          "items": [
            "Ensure reliable power supply and audio quality during all meetings and rehearsals.",
            "Supervise sound mixing and monitor the performance of sound engineers."
          ]
        },
        {
          "category": "Equipment Oversight",
          "items": [
            "Maintain all technical equipment, ensuring proper use, regular servicing, and adherence to the equipment leasing policy.",
            "Approve all equipment use and ensure proper documentation for accountability."
          ]
        },
        {
          "category": "Operational Excellence",
          "items": [
            "Guarantee that sound engineers are prepared and the sound system is fully operational at least 30 minutes before every meeting.",
            "Ensure the technical team is punctual, properly dressed, and ready for service operations."
          ]
        },
        {
          "category": "Training and Development",
          "items": [
            "Facilitate the training of new and existing members, focusing on technical skills and operational protocols.",
            "Mentor unskilled members to ensure their proficiency in technical operations within a short period."
          ]
        },
        {
          "category": "Reporting and Feedback",
          "items": [
            "Provide regular updates to the Administrator on the Department’s performance, equipment status, and challenges; Recommend improvements to enhance the Department’s efficiency and service delivery.",
            "Present report at URPN workforce meetings"
          ]
        },
        {
          "category": "Additional Responsibilities",
          "items": [
            "Undertake other tasks assigned by the Governing Council or Administrator to support the ministry’s technical needs."
          ]
        }
      ],
      "kpis": [
        "Timely and reliable power and sound setup for services and events.",
        "High-quality sound production during all meetings and programs.",
        "Proper maintenance and accountability of technical equipment.",
        "Positive feedback from other Departments and leadership on technical support.",
        "Growth and skill development within the  Technical Department."
      ]
    }
  },
  "media": {
    "departmentName": "Media Department",
    "overview": "Media Department The Media Department is responsible for managing the ministry’s audio-visual production, online presence, and branding. This team ensures the content of the ministry is presented, preserved, and projected with excellence, both online and offline. Headed by the Head of the Media Department (HOD Media), the Department plays a pivotal role in publicity, content creation, and maintaining the ministry's visual identity. The Department operates with creativity, precision, and professionalism to support the ministry’s vision. The department will accept skilled and unskilled members into the Department, providing training to unskilled members within a short timeframe.",
    "responsibilities": [
      {
        "category": "Social Media/Community Engagement",
        "items": [
          "Manage and engage the ministry’s online community during and after meetings through social media platforms and other channels.",
          "Respond promptly to comments, inquiries, and interactions to foster a positive online presence."
        ]
      },
      {
        "category": "Media Resource Management",
        "items": [
          "Manage and maintain all media resources, both online and offline, ensuring their quality and accessibility.",
          "Catalogue and classify ministry messages based on themes and emphasis, ensuring proper documentation and organization."
        ]
      },
      {
        "category": "Content Creation",
        "items": [
          "Design and produce high-quality publicity materials, including graphics, videos, and written content for ministry events and programs.",
          "Develop and maintain the ministry’s branding standards, including colours, fonts, and overall aesthetic alignment.",
          "Title messages where the preacher did not announce a title during the sermon.",
          "Develop graphical and other materials to celebrate leaders, parents, and partners on special occasions like birthdays and anniversaries."
        ]
      },
      {
        "category": "Equipment Maintenance",
        "items": [
          "Oversee the safety and proper maintenance of all media equipment, ensuring functionality and longevity.",
          "Address careless treatment of equipment by repairing or replacing damaged items at the Prayer Department’s expense."
        ]
      },
      {
        "category": "Lighting / Management",
        "items": [
          "Co-manage the hall’s lighting setup for meetings and events in collaboration with the Technical Uni and Aesthetics Departments.",
          "Manage the ministry’s lights (business and maintenance)"
        ]
      },
      {
        "category": "Audio-Visual Production",
        "items": [
          "Ensure audio recordings are ready immediately after meetings.",
          "Prepare and deliver pictures and video clips by the second day after meetings, with at least one clip uploaded weekly."
        ]
      },
      {
        "category": "Additional Responsibilities",
        "items": [
          "Undertake other tasks as assigned by the Governing Council or Administrator to support the ministry’s objectives."
        ]
      }
    ],
    "keyAttributes": [
      "Creativity, technical expertise, and attention to detail.",
      "Attention to details",
      "Familiarity with social media platforms and engagement strategies.",
      "Ability to work under deadlines and deliver quality content promptly.",
      "A strong sense of responsibility for equipment and resources.",
      "Team-oriented with a willingness to learn and adapt.",
      "Must be smartly dressed for services and events."
    ],
    "headOfDepartment": {
      "title": "Head of Media Department (HOD Media) Job Description",
      "summary": "The Head of the Media Department (HOD Media) provides leadership and oversight for all media operations, ensuring excellence in audio-visual production, branding, and online engagement. The HOD Media is responsible for the growth and development of the Department, coordinating its activities across all lampstands, and aligning its work with the ministry’s vision. Reporting to the Administrator, this role requires strategic planning, creativity, and effective team management.",
      "responsibilities": [
        {
          "category": "Leadership and Oversight",
          "items": [
            "Provide direction and leadership for the Media Department, ensuring all tasks are executed efficiently and with excellence.",
            "Supervise sub-Prayer Departments and assign responsibilities to members based on their skills and roles.",
            "Partner with the Technical Department and Aesthetics to manage lighting and technical needs for meetings.",
            "Act as the leader for media teams during major convergences, ensuring coordination among lampstand Departments.",
            "Establish and oversee sub-Prayer Departments to handle specialized tasks, including:",
            "Social Media Manager: Handles online engagement and posts.",
            "Audio Personnel: Manages sound recordings.",
            "Visual/Video Personnel: Handles video recording and editing.",
            "Graphics Designer: Creates promotional and publicity materials"
          ]
        },
        {
          "category": "Content and Branding Management",
          "items": [
            "Ensure all content produced aligns with the ministry’s branding standards and aesthetic decisions.",
            "Oversee the design of publicity materials for events, programs, and social media."
          ]
        },
        {
          "category": "Online Engagement",
          "items": [
            "Strategize and manage online interactions during and after meetings, maintaining a vibrant and positive online presence.",
            "Develop campaigns to increase online engagement and reach."
          ]
        },
        {
          "category": "Audio-Visual Supervision",
          "items": [
            "Ensure timely delivery of audio recordings, pictures, and video clips after meetings.",
            "Oversee the cataloguing and classification of messages, ensuring proper documentation."
          ]
        },
        {
          "category": "Equipment Management",
          "items": [
            "Monitor the maintenance and safety of all media equipment, ensuring proper use and handling.",
            "Implement accountability measures for repairing or replacing damaged equipment."
          ]
        },
        {
          "category": "Member Development and Training",
          "items": [
            "Facilitate training for members, focusing on technical skills, creativity, and professional standards.",
            "Mentor unskilled members, ensuring they become proficient in media operations within a short timeframe."
          ]
        },
        {
          "category": "Budgeting and Administration",
          "items": [
            "Prepare and manage the Department’s budget, ensuring efficient allocation of resources.",
            "Oversee the collection and management of dues to support the Department’s activities."
          ]
        },
        {
          "category": "Reporting and Feedback",
          "items": [
            "Provide regular updates to the Administrator on the Department’s progress, challenges, and performance.; Recommending improvements to enhance the Department’s effectiveness and output.",
            "Report progress and challenges at the URPN workforce meetings"
          ]
        },
        {
          "category": "Additional Responsibilities",
          "items": [
            "Undertake other tasks as assigned by the Governing Council or Administrator to support the ministry’s goals."
          ]
        }
      ],
      "kpis": [
        "Timeliness and quality of audio, video, and graphic content delivery.",
        "Growth and engagement of the online community.",
        "Maintenance and safety of media equipment.",
        "Positive feedback on publicity materials and branding alignment.",
        "Effective coordination of media teams across lampstands."
      ]
    }
  },
  "choir": {
    "departmentName": "Worship Team (Choir)",
    "overview": "Worship Team (Choir) The Choir, also known as the Worship Team, is responsible for leading worship and ministering through music during all services and programs. This Department fosters a spirit of worship and creates an atmosphere that encourages powerful encounters with God through music. The team operates under the leadership of the Music Director (MD) and is supervised globally by the Music Pastor, who reports to the Administrator.",
    "responsibilities": [
      {
        "category": "Music Ministry and Song Compilation",
        "items": [
          "Compile and minister indigenous songs received by team members or the ministry at regular intervals. (Submit all original songs to the Music Pastor for review and approval before recording or public use).",
          "Incorporate songs from external sources into worship sessions as appropriate."
        ]
      },
      {
        "category": "Rehearsals and Preparation",
        "items": [
          "Conduct regular, consistent, and focused rehearsals as agreed by the Department, ensuring readiness for all services and programs.",
          "Fostering disciplined members who are skilled and spiritually developed."
        ]
      },
      {
        "category": "Additional Responsibilities",
        "items": [
          "Undertake other tasks as assigned by the Governing Council or Music Pastor to support the ministry’s goals."
        ]
      }
    ],
    "keyAttributes": [
      "A strong passion for worship and a heart for music.",
      "Commitment to spiritual growth and excellence in musical skills.",
      "Discipline, punctuality, and dedication to rehearsals and services.",
      "Ability to work collaboratively with other team members and leadership.",
      "Respect for ministry standards and adherence to dress codes.",
      "Good sense of decent fashion"
    ],
    "headOfDepartment": {
      "title": "Music Director (MD)",
      "summary": "The Music Director (MD) serves as the leader of the Worship Team at the Headquarters or Lampstands, overseeing all musical activities and ensuring that worship is conducted with excellence. The MD is responsible for rehearsals, song selection, team coordination, and adherence to ministry standards. The MD reports directly to the Music Pastor, who supervises all Worship Teams globally and reports to the Administrator.",
      "responsibilities": [
        {
          "category": "Leadership and Oversight",
          "items": [
            "Provide direction and leadership for the Worship Team, ensuring all activities align with the ministry’s vision and standards.",
            "Delegate responsibilities to sub-department leaders and team members to enhance efficiency and focus."
          ]
        },
        {
          "category": "Song Compilation and Approval",
          "items": [
            "Compile indigenous songs for the Department and submit them to the Music Pastor for scrutiny and approval.",
            "Oversee the inclusion of songs received by team members into worship sessions and manage song arrangements."
          ]
        },
        {
          "category": "Rehearsals and Skill Development",
          "items": [
            "Plan and lead consistent and effective rehearsals, ensuring all team members are prepared for services.",
            "Mentor and develop team members, fostering both spiritual and musical growth."
          ]
        },
        {
          "category": "Dress Code and Compliance",
          "items": [
            "Enforce adherence to the approved dress code for both rehearsals and public ministrations.",
            "Monitor the team’s appearance to ensure modesty, uniformity, and alignment with ministry standards."
          ]
        },
        {
          "category": "Coordination with the Music Pastor",
          "items": [
            "Maintain regular communication with the Music Pastor, providing updates on team performance, challenges, and progress.",
            "Work collaboratively with the Music Pastor to ensure Lampstand Worship Teams follow ministry-wide directives."
          ]
        },
        {
          "category": "Sub-Department and Role Management",
          "items": [
            "Establish and oversee sub-departments (e.g., instrumentalists, vocalists, songwriters) to streamline operations and focus on specific areas.",
            "Assign leadership roles within the team to manage sub-departments effectively."
          ]
        },
        {
          "category": "Global Meetings and Coordination",
          "items": [
            "Collaborate with other Lampstand MDs during convergences and major meetings to ensure a unified worship experience.",
            "Represent the Worship Team at global meetings and provide input on ministry-wide worship initiatives."
          ]
        },
        {
          "category": "Additional Responsibilities",
          "items": [
            "Undertake other tasks as assigned by the Music Pastor, Administrator, or Governing Council.",
            "Music Pastor",
            "Position Summary",
            "The Music Pastor serves as the global head of the Worship Team, providing spiritual and administrative oversight for all Worship Teams across the Headquarters and Lampstands. Reporting to the Administrator, the Music Pastor ensures that all Worship Teams align with the ministry’s vision and standards while fostering a spirit of worship across all locations.",
            "Key Responsibilities"
          ]
        },
        {
          "category": "Global Leadership and Supervision",
          "items": [
            "Provide spiritual and administrative oversight for all Worship Teams, ensuring unity and alignment with ministry directives.",
            "Supervise Music Directors at the Headquarters and Lampstands, providing guidance and support."
          ]
        },
        {
          "category": "Song Review and Approval",
          "items": [
            "Scrutinize and approve all indigenous songs submitted by the Worship Teams before recording or public use.",
            "Provide feedback and direction for song arrangement and selection."
          ]
        },
        {
          "category": "Coordination and Communication",
          "items": [
            "Maintain regular communication with Lampstand Music Directors to address challenges and ensure consistent standards.",
            "Report Worship Team performance, challenges, and achievements to the Administrator."
          ]
        },
        {
          "category": "Training and Development",
          "items": [
            "Facilitate training sessions for Worship Teams, focusing on spiritual growth, musical excellence, and adherence to ministry values.",
            "Encourage the growth of Lampstand Worship Teams, ensuring their alignment with the ministry’s vision."
          ]
        },
        {
          "category": "Global Event Oversight",
          "items": [
            "Coordinate Worship Teams during global events and convergences, ensuring a seamless and powerful worship experience."
          ]
        },
        {
          "category": "Additional Responsibilities",
          "items": [
            "Undertake other tasks as assigned by the Administrator or Governing Council to support the ministry’s worship objectives."
          ]
        }
      ],
      "kpis": [
        "Excellence in worship during services and global events.",
        "Timely submission and approval of indigenous songs.",
        "Growth and development of Worship Teams at the Headquarters and Lampstands.",
        "Positive feedback on the spiritual and musical impact of worship sessions.",
        "Unity and alignment across all Worship Teams globally."
      ]
    }
  },
  "welfare": {
    "departmentName": "Welfare and Hospitality Department",
    "overview": "Welfare and Hospitality Department The Welfare and Hospitality Department is dedicated to meeting the needs of members, guests, and participants by providing practical support, comfort, and care. This department fosters a culture of compassion and service, ensuring the well-being of individuals both within and outside the ministry. Headed by the Welfare Director, the team coordinates resources, plans meals, and manages budgets to provide a welcoming and supportive environment during all meetings and programs.",
    "responsibilities": [
      {
        "category": "General Responsibilities",
        "items": [
          "Plan and manage budgets for the feeding and welfare of guest ministers at every meeting.",
          "Collaborate with the Protocol Department to secure decent and affordable accommodations and resources for guest ministers.:",
          "Ensure the availability of comfort items such as portable water, handkerchiefs, and other essential resources for ministers and participants during meetings.",
          "Anticipate the needs of attendees and provide practical solutions to ensure their comfort.",
          "Develop and execute meal plans for required URPN programs, like the Workforce appreciation dinner.",
          "Coordinate the feeding of participants during meetings that require camping and extended durations.",
          "Work closely with other departments, such as Protocol and Administration, to ensure seamless operations during meetings and events.",
          "Undertake any other tasks assigned by the Administrator to support the ministry’s welfare and hospitality objectives."
        ]
      }
    ],
    "keyAttributes": [
      "Compassion, empathy, and a heart for service.",
      "Strong organisational and multitasking skills.",
      "Ability to manage resources and budgets effectively.",
      "Excellent teamwork and collaboration abilities.",
      "A commitment to maintaining a welcoming and supportive environment.",
      "Event management and catering skills."
    ],
    "headOfDepartment": {
      "title": "Welfare Head of Department",
      "summary": "The Welfare Head of Department, provides leadership and oversight for the Welfare and Hospitality Department, ensuring that all welfare-related activities align with the ministry’s vision of compassion and support. Reporting to the Administrator, the Welfare Director coordinates the team, manages budgets, and collaborates with other departments to provide care and comfort to members, guests, and participants during all ministry programs.",
      "responsibilities": [
        {
          "category": "Leadership and Oversight",
          "items": [
            "Lead the Welfare and Hospitality Department, ensuring all activities are carried out with excellence and compassion.",
            "Provide direction to team members and delegate tasks to achieve departmental goals."
          ]
        },
        {
          "category": "Guest Minister Care",
          "items": [
            "Plan and oversee the welfare of guest ministers, including accommodations, feeding, and other comfort-related needs.",
            "Work with the Protocol Department to secure high-quality, affordable resources for guest ministers."
          ]
        },
        {
          "category": "Participant Welfare",
          "items": [
            "Ensure that all participants, especially during major meetings and events, have access to essential resources and support.",
            "Anticipate the needs of attendees and create strategies to address them effectively."
          ]
        },
        {
          "category": "Meal Planning and Execution",
          "items": [
            "Oversee the planning and execution of all meals during URPN programs, including special events and in-house meetings.",
            "Ensure meals are prepared efficiently, with quality and cost-effectiveness in mind."
          ]
        },
        {
          "category": "Budgeting and Financial Management",
          "items": [
            "Develop and manage budgets for all welfare-related activities, maintaining transparency and accountability.",
            "Approve expenditures and ensure resources are utilized effectively."
          ]
        },
        {
          "category": "Reporting",
          "items": [
            "Provide regular updates and reports to the Administrator on departmental activities.",
            "Present reports at meetings"
          ]
        },
        {
          "category": "Additional Responsibilities",
          "items": [
            "Undertake other tasks assigned by the Governing Council to support the ministry’s welfare and hospitality goals."
          ]
        }
      ],
      "kpis": [
        "Successful execution of welfare plans during services and events.",
        "Positive feedback from guest ministers, participants, and team members.",
        "Efficient budget management and resource allocation.",
        "Growth and development of the Welfare and Hospitality team.",
        "Alignment of all activities with the ministry’s vision and standards."
      ]
    }
  },
  "prayer": {
    "departmentName": "Prayer Department",
    "overview": "Prayer Department The Prayer Department is the ministry's specific intercessory arm, dedicated to fostering a culture of prayer and intercession. Under the leadership of the Prayer Coordinator, this Department ensures that prayer is integrated into all aspects of the ministry’s activities, empowering individuals and supporting leadership through intercession. Every member of this Department is expected to be intentional and consistent with prayer and intercession, reflecting the ministry's commitment to prayer as a foundation of its operations and vision.",
    "responsibilities": [
      {
        "category": "General Responsibilities",
        "items": [
          "Regularly intercede for the ministry’s leaders, services, programs, and plans.",
          "Provide a spiritual cover in prayers for the Pastor(s) and other leaders consistently.",
          "Ensure that prayer is a key component in every Department and committee, promoting a culture of prayer across the ministry.",
          "Collaborate with Department leaders to integrate prayer into their activities and encourage prayer-driven decision-making.",
          "Create and maintain an information network to keep members informed of prayer concerns and requests.",
          "Develop an effective prayer chain to facilitate timely intercession for urgent matters.",
          "Plan and organize ministry-wide prayer events, such as prayer vigils, retreats, and intercessory meetings.",
          "Encourage Department-specific and committee retreats to deepen members' prayer lives and spiritual growth.",
          "Receive and intercede for individual concerns and prayer requests from members of the ministry.",
          "Be available to pray with individuals as needed, offering encouragement and spiritual guidance.",
          "Work with the Vice President and Administrator to provide opportunities for members to enrich their prayer lives.",
          "Contribute articles or testimonies about prayer to the ministry’s social media platforms, encouraging the congregation to engage in prayer.",
          "Undertake other tasks assigned by the Governing Council to support the ministry’s prayer objectives."
        ]
      }
    ],
    "keyAttributes": [
      "A deep commitment to prayer and intercession.",
      "Sensitivity to the Holy Spirit and spiritual discernment.",
      "Strong organisational and communication skills.",
      "A heart for supporting others through prayer.",
      "Willingness to collaborate and integrate prayer into various ministry activities."
    ],
    "headOfDepartment": {
      "title": "Prayer Coordinator",
      "summary": "The Prayer Coordinator is the leader of the Prayer Department, responsible for fostering a culture of prayer across the ministry. Reporting to the Vice President through the Administrator, the Prayer Coordinator provides leadership, strategy, and support for all prayer activities, ensuring that intercession undergirds every aspect of the ministry. The Prayer Coordinator also mentors prayer leaders and integrates prayer into the ministry’s vision and operations.",
      "responsibilities": [
        {
          "category": "Leadership and Oversight",
          "items": [
            "Provide strategic leadership for the Prayer Department, ensuring prayer activities align with the ministry’s goals and vision.",
            "Identify and train key prayer leaders at the Headquarters and Lampstands to build a united and effective prayer network.",
            "Mentor members of the Prayer Department, helping them grow as intercessors and spiritual leaders.",
            "Stay connected with Lampstand prayer leaders to ensure unity and alignment across the ministry.",
            "Manage the Prayer cells and leadership; ensuring excellence and consistent operations.",
            "Assign prayer tasks and ministrations at services and events."
          ]
        },
        {
          "category": "Operational functions",
          "items": [
            "Collaborate with Department heads and committee leaders to ensure prayer is woven into their activities.",
            "Promote prayer-driven decision-making at all levels of the ministry.",
            "Plan and oversee the execution of prayer events, retreats, and vigils, encouraging active participation from members.",
            "Facilitate periodic prayer retreats for Departments and committees to strengthen their spiritual foundation.",
            "Develop and maintain an effective prayer chain to address urgent prayer needs promptly.",
            "Communicate prayer concerns and updates to the congregation through the ministry’s information network.",
            "Regularly contribute articles, testimonies, and prayer resources for the ministry’s social media platforms, fostering engagement and encouragement.",
            "Guide the titling and classification of prayer resources to ensure accessibility and relevance.",
            "Discern future prayer needs and strategies for the ministry, aligning prayer efforts with the ministry’s direction.",
            "Provide feedback and recommendations to the Administrator on how to strengthen the prayer ministry."
          ]
        },
        {
          "category": "Reporting",
          "items": [
            "Provide regular updates and reports to the Administrator on departmental activities.",
            "Present reports at meetings"
          ]
        },
        {
          "category": "Additional Responsibilities",
          "items": [
            "Undertake other tasks assigned by the administrator to support the ministry’s prayer objectives."
          ]
        }
      ],
      "kpis": [
        "Consistent participation and engagement in prayer events and activities.",
        "Growth and effectiveness of the prayer network across the ministry.",
        "Positive feedback on the integration of prayer into various Departments and committees.",
        "Impact of prayer on ministry leadership, programs, and goals.",
        "Successful mentoring and development of prayer leaders and members."
      ],
      "qualifications": [
        "A deep personal commitment to prayer and a strong spiritual foundation.",
        "Proven leadership and mentoring abilities.",
        "Organizational and strategic planning skills.",
        "Excellent communication and interpersonal abilities.",
        "Discernment and sensitivity to the Holy Spirit."
      ]
    }
  },
  "counseling": {
    "departmentName": "Counseling Department",
    "overview": "The Counseling Department provides spiritual and emotional support to individuals within the ministry by offering guidance, counselling, and follow-up care. This Department operates under the leadership of the Head of the Counselling Department, who collaborates with the Administrator and Public Relations Department to facilitate appointments and ensure counselling activities align with the ministry’s vision. The Department is dedicated to fostering spiritual growth, emotional healing, and holistic support for members and clients.",
    "responsibilities": [
      {
        "category": "Operational expectation",
        "items": [
          "Maintain accurate and up-to-date counselling records, ensuring confidentiality and proper documentation of follow-up activities.",
          "Provide timely and comprehensive counselling reports to the Administrator and relevant leadership.",
          "Offer short-term counselling to individuals, addressing spiritual, emotional, and personal challenges with sensitivity and compassion.",
          "Develop and provide a broad spectrum of spiritual and therapeutic support tailored to individual needs.",
          "Develop and distribute counselling-related materials, including spiritual resources, informational guides, and support materials for clients and counsellors.",
          "Work with the Mission Team to extend counselling services during outreach programs and ministry events.",
          "Welcome the first-timers and introduce them to the ministry’s vision, mission and mandate."
        ]
      },
      {
        "category": "Other Duties",
        "items": [
          "Undertake additional responsibilities as assigned by the Administrator or Governing Council to support the ministry’s counselling objectives."
        ]
      }
    ],
    "keyAttributes": [
      "Strong empathy, listening, and interpersonal skills.",
      "A solid foundation in spiritual and biblical principles.",
      "Ability to maintain confidentiality and professionalism.",
      "Strong organisational and documentation skills.",
      "A commitment to personal and spiritual growth."
    ],
    "headOfDepartment": {
      "title": "Head of the Counseling Department Job Description",
      "summary": "The HOD of the Counselling Department leads the ministry’s counselling activities, providing strategic direction, training, and supervision to the counselling team. Reporting directly to the Administrator, the HOD works collaboratively with the Public Relations Department and Administrators to facilitate appointments, manage counselling services, and ensure the department’s effectiveness in addressing the needs of individuals. The HOD fosters a culture of compassion, confidentiality, and spiritual growth within the counselling team.",
      "responsibilities": [
        {
          "category": "Leadership and Oversight",
          "items": [
            "Provide leadership and direction for the Counseling Department, ensuring all activities align with the ministry’s mission and vision.",
            "Mentor and supervise counsellors, fostering their professional and spiritual development.",
            "Organize training programs for counsellors to enhance their skills and spiritual competence. Provide regular supervision and review of caseloads to ensure effective case management."
          ]
        },
        {
          "category": "Operational duties",
          "items": [
            "Screen counselling requests and assign members in need to the most suitable counsellors.",
            "Offer direct counselling to individuals when necessary, addressing complex or sensitive cases.",
            "Ensure accurate and confidential record-keeping of counselling sessions, follow-ups, and outcomes.",
            "Submit detailed counselling reports to the Administrator and relevant leadership.",
            "Create and distribute counselling resources, including spiritual guides, informational pamphlets, and therapy tools.",
            "Ensure materials are accessible, relevant, and aligned with the ministry’s spiritual principles.",
            "Develop departmental goals and prioritize programs to address the diverse needs of members.",
            "Regularly evaluate the Department’s performance and implement improvements to enhance service delivery."
          ]
        },
        {
          "category": "Reporting",
          "items": [
            "Provide regular updates and reports to the Administrator on departmental activities.",
            "Present reports at meetings"
          ]
        },
        {
          "category": "Additional Responsibilities",
          "items": [
            "Undertake other duties as assigned by the Administrator or Governing Council to support the ministry’s counselling efforts."
          ]
        }
      ],
      "kpis": [
        "Effectiveness in screening and assigning clients to counsellors.",
        "Positive feedback from our community and workers on the Department’s services.",
        "Growth in the competency and spiritual maturity of counselling team members.",
        "Timeliness and accuracy in maintaining counselling records and reports.",
        "Successful integration of counselling services in ministry programs and outreach."
      ]
    }
  },
  "transport": {
    "departmentName": "Transport Department",
    "overview": "The Transport Department is responsible for the planning, execution, and coordination of all transportation activities within the ministry. This includes ensuring the safe and efficient transport of members, guests, and materials to and from meetings, events, and other activities. The department manages budgets, schedules, and routes while ensuring vehicles are safe, legally compliant, and maintained in excellent condition. The department operates with professionalism, focusing on safety, efficiency, and a positive member experience. The department is led by the Head of Department (HOD), who reports directly to the Administrator.",
    "responsibilities": [
      {
        "category": "Passenger Transport",
        "items": [
          "Ensure the safe and efficient transport of members, guests, and materials to and from meetings, special events, and other activities.",
          "Follow pre-planned routes and schedules, or accommodate unscheduled pick-ups and drop-offs as requested.",
          "Assist passengers in boarding and exiting vehicles, especially those needing extra help."
        ]
      },
      {
        "category": "Vehicle Safety and Inspection",
        "items": [
          "Conduct thorough inspections of vehicles at the start of each shift, checking the functionality of headlights, turn signals, brake lights, interior lighting, air conditioning or heating, mirror adjustment, tyres, windshield wipers, and more."
        ]
      },
      {
        "category": "Vehicle Maintenance and Cleanliness",
        "items": [
          "Ensure vehicles are properly cleaned inside and out to maintain a professional appearance.",
          "Keep vehicles fueled and ready for operation at all times."
        ]
      },
      {
        "category": "Record Keeping and Reporting",
        "items": [
          "Maintain accurate trip sheets for each shift, including details such as driver number, vehicle number, number of passengers, pick-up and drop-off times, mileage, and destinations.",
          "Provide timely reports on transportation activities, including accidents, safety concerns, and maintenance needs."
        ]
      },
      {
        "category": "Compliance and Safety",
        "items": [
          "Ensure all vehicles meet legal and safety requirements, maintaining proper documentation and compliance with regulations.",
          "Promote a culture of safety within the department, emphasizing responsible driving and passenger care."
        ]
      },
      {
        "category": "Additional Responsibilities",
        "items": [
          "Perform other tasks as assigned by the Administrator to support the ministry’s transportation needs."
        ]
      }
    ],
    "keyAttributes": [
      "Strong commitment to safety and professionalism.",
      "Excellent interpersonal and communication skills.",
      "Attention to detail, especially in vehicle inspections and record keeping.",
      "Punctuality and reliability in following schedules.",
      "Ability to maintain a positive attitude under pressure."
    ],
    "headOfDepartment": {
      "title": "Head of Transport Department (HOD)",
      "summary": "The Head of the Transport Department (HOD) is responsible for leading and managing all transportation activities within the ministry. The HOD ensures the safe, efficient, and professional execution of transport services, oversees vehicle maintenance and compliance, and supervises drivers to maintain high standards of safety and courtesy. Reporting to the Administrator, the HOD also manages departmental budgets, routes, and schedules while promoting a culture of excellence and safety.",
      "responsibilities": [
        {
          "category": "Leadership and Oversight",
          "items": [
            "Provide strategic leadership and direction for the Transport Department, ensuring all activities align with the ministry’s vision and goals.",
            "Supervise and coordinate the work of drivers, ensuring professionalism and adherence to schedules."
          ]
        },
        {
          "category": "Budgeting and Planning",
          "items": [
            "Develop and manage the department’s budget, ensuring cost-effective and efficient operations.",
            "Plan and coordinate routes, schedules, and resources to optimize transportation services."
          ]
        },
        {
          "category": "Safety and Compliance",
          "items": [
            "Ensure all vehicles meet legal, safety, and operational standards, maintaining up-to-date documentation and compliance with regulations.",
            "Promote a culture of safety among department members, emphasizing responsible driving and vehicle care."
          ]
        },
        {
          "category": "Vehicle Maintenance and Management",
          "items": [
            "Oversee the regular inspection, cleaning, and fueling of vehicles to ensure readiness and reliability.",
            "Address maintenance needs promptly, coordinating repairs and replacements as necessary."
          ]
        },
        {
          "category": "Driver Training and Supervision",
          "items": [
            "Train drivers on their responsibilities, including safety procedures, passenger courtesy, and vehicle maintenance.",
            "Monitor driver performance, providing feedback and guidance to maintain high standards."
          ]
        },
        {
          "category": "Record Keeping and Reporting",
          "items": [
            "Ensure accurate record-keeping of transportation activities, including trip sheets, mileage, maintenance logs, and incident reports.",
            "Submit regular reports to the Administrator on the department’s activities, challenges, and progress."
          ]
        },
        {
          "category": "Manage Passenger Experience",
          "items": [
            "Ensure passengers are treated with courtesy and professionalism, fostering a positive experience for members and guests.",
            "Address any passenger concerns or complaints promptly and effectively.",
            "Work with other departments to coordinate transportation needs for special events, meetings, and outreach programs.",
            "Solve logistical challenges, such as route adjustments or vehicle availability, to ensure seamless operations."
          ]
        },
        {
          "category": "Reporting",
          "items": [
            "Provide regular updates and reports to the Administrator on departmental activities.",
            "Present reports at meetings"
          ]
        },
        {
          "category": "Additional Responsibilities",
          "items": [
            "Undertake other tasks as assigned by the Administrator to support the ministry’s transportation objectives."
          ]
        }
      ],
      "kpis": [
        "Timely and efficient execution of transport schedules and routes.",
        "Positive feedback from passengers on service quality and driver professionalism.",
        "Compliance with legal and safety standards for all vehicles.",
        "Accurate and thorough record-keeping of transportation activities.",
        "Effective management of departmental budgets and resources."
      ],
      "qualifications": [
        "Strong leadership and organizational skills.",
        "Experience in transportation management or a related field.",
        "Excellent interpersonal and communication abilities.",
        "Commitment to safety, efficiency, and customer service.",
        "Familiarity with vehicle maintenance and compliance requirements."
      ]
    }
  },
  "medical": {
    "departmentName": "Medical Department (Medics)",
    "overview": "The Medical Department (Medics) is a vital component of the ministry, responsible for providing healthcare services, emergency medical care, and health-related support during meetings, events, and outreach programs. The team ensures the safety and well-being of all members and guests while contributing to the overall ministry's outreach, safety, and security efforts. This department is led by a qualified Medical Doctor as the Head of Department (HOD) who oversees all activities and reports to the ministry’s leadership. Eligibility Members of the Medical Department must have experience or qualifications in healthcare fields such as medicine, nursing, pharmacy, paramedics, emergency medical services, or related areas. Membership is voluntary, reflecting a commitment to serve the ministry and its members. Hierarchy and Leadership The department is headed by a Head of the Medical Department (HOD) with at least a medical qualification and appropriate licensing or professional recognition. In-house leadership positions may be established to support teamwork and improve operational efficiency. Training and Development Although members typically have prior medical experience, ongoing training in modern medical practices, First Aid techniques, and emergency response is mandatory. Training is organized by the department leadership and funded by the ministry upon approval. Training topics include advanced emergency medical techniques, health counselling, and biohazard safety measures.",
    "responsibilities": [
      {
        "category": "Direct Patient Care",
        "items": [
          "Provide medical care for injuries, illnesses, and emergencies during ministry activities and events.",
          "Administer medications as necessary and within the scope of medical guidelines."
        ]
      },
      {
        "category": "Health Records and Confidentiality",
        "items": [
          "Maintain strict confidentiality when handling health records and patient privacy.",
          "Chart and accurately document all medical visits and treatments provided."
        ]
      },
      {
        "category": "Emergency Response and Referrals",
        "items": [
          "Handle life-threatening injuries and emergency medical situations promptly.",
          "Refer cases that exceed the department’s scope to appropriate medical facilities, ensuring compliance with local laws and regulations."
        ]
      },
      {
        "category": "Health Counseling and Education",
        "items": [
          "Offer health counselling and distribute resource materials to promote well-being.",
          "Provide training and information to staff and members on various illnesses, accident prevention, and safety measures."
        ]
      },
      {
        "category": "Health Screening and Safety",
        "items": [
          "Conduct general health screenings for members and guests during events.",
          "Ensure proper safety measures when dealing with biohazards such as body fluids.",
          "Work with the marriage council to advise and conduct all required medical screening for marriage approval."
        ]
      },
      {
        "category": "Seminars and Outreach Support",
        "items": [
          "Assist in planning and conducting medically related seminars, community services, and outreach programs.",
          "Collaborate with other departments to enhance the ministry’s outreach and safety initiatives.",
          "Provide healthcare support during special events, offering comfort and assurance to members and guests."
        ]
      },
      {
        "category": "Contribution to Safety Programs",
        "items": [
          "Work alongside the ministry’s security and safety programs to ensure a holistic approach to well-being."
        ]
      },
      {
        "category": "Additional Responsibilities",
        "items": [
          "Undertake other duties assigned by the Governing Council to support the ministry’s healthcare and safety objectives."
        ]
      }
    ],
    "keyAttributes": [
      "Professionalism, empathy, and discretion.",
      "Strong communication and teamwork skills.",
      "Ability to remain calm under pressure and respond to emergencies effectively.",
      "Commitment to continuous learning and skill development.",
      "Adherence to medical ethics and legal guidelines."
    ],
    "headOfDepartment": {
      "title": "Head of Medical Department (HOD) Job Description",
      "summary": "The Head of the Medical Department (HOD) provides leadership, oversight, and strategic direction for the Medical Department. The HOD ensures the efficient operation of the department, organizes training, manages healthcare services, and oversees the safety and well-being of members and guests. Reporting directly to ministry leadership, the HOD plays a pivotal role in aligning the department’s activities with the ministry’s goals.",
      "responsibilities": [
        {
          "category": "Leadership and Coordination",
          "items": [
            "Provide leadership for all medical activities, ensuring alignment with the ministry’s vision and goals.",
            "Delegate responsibilities within the department and establish a supportive team culture."
          ]
        },
        {
          "category": "Training and Skill Development",
          "items": [
            "Organize mandatory training for department members, focusing on modern medical practices, emergency response, and First Aid.",
            "Ensure all team members are equipped to handle medical emergencies and routine healthcare needs."
          ]
        },
        {
          "category": "Healthcare Services Management",
          "items": [
            "Supervise the provision of medical care during ministry activities, events, and outreach programs.",
            "Oversee health screenings, safety measures, and the administration of medications."
          ]
        },
        {
          "category": "Confidentiality and Record Keeping",
          "items": [
            "Ensure accurate documentation of medical visits and procedures while maintaining strict confidentiality.",
            "Regularly review records for compliance with medical and legal standards."
          ]
        },
        {
          "category": "Emergency Response and Safety",
          "items": [
            "Develop protocols for responding to medical emergencies and ensure team members are familiar with them.",
            "Ensure the department is equipped to handle biohazards and other safety concerns."
          ]
        },
        {
          "category": "Collaboration and Outreach",
          "items": [
            "Work with other departments to support seminars, community services, and ministry outreach programs.",
            "Partner with leadership to promote health-related initiatives."
          ]
        },
        {
          "category": "Budget and Resource Management",
          "items": [
            "Plan and manage the department’s budget, ensuring resources are used efficiently.",
            "Advocate for necessary equipment, training, and supplies to enhance the department’s effectiveness."
          ]
        },
        {
          "category": "Legal and Ethical Compliance",
          "items": [
            "Ensure all medical activities comply with local laws and ethical standards.",
            "Address complex or severe cases by referring them to appropriate medical facilities."
          ]
        },
        {
          "category": "Reporting",
          "items": [
            "Provide regular updates and reports to the Administrator on departmental activities.",
            "Present reports at meetings"
          ]
        },
        {
          "category": "Additional Responsibilities",
          "items": [
            "Undertake other tasks assigned by the Governing Council to support the ministry’s healthcare and safety objectives."
          ]
        }
      ],
      "kpis": [
        "Timely and effective response to medical emergencies.",
        "Positive feedback from members and guests on healthcare services.",
        "Successful completion of training programs and skill development for team members.",
        "Compliance with legal and ethical standards in medical activities.",
        "Efficient use of resources and budget management."
      ],
      "qualifications": [
        "A licensed medical professional with experience in healthcare leadership.",
        "Strong organisational and communication skills.",
        "Ability to manage emergencies and make quick, informed decisions.",
        "Commitment to continuous learning and training.",
        "Knowledge of medical ethics and legal requirements."
      ]
    }
  },
  "security": {
    "departmentName": "Security Department",
    "overview": "The Security Department is responsible for ensuring the safety of lives and properties within the ministry during services, special events, and daily operations. This department maintains vigilance, mitigates risks, and assists in emergencies to provide a secure environment for members and guests. The department operates under the leadership of the Head of the Security Department (Chief Security Officer), who supervises all security personnel and collaborates with external security agencies when needed.",
    "responsibilities": [
      {
        "category": "Vigilance and Surveillance",
        "items": [
          "Maintain constant awareness of surroundings while on duty to detect and deter potential threats.",
          "Report any suspicious activities promptly to the team leader or relevant authorities."
        ]
      },
      {
        "category": "Safety and Emergency Assistance",
        "items": [
          "Prioritize the protection of lives and properties during all services and events.",
          "Respond to emergencies, including medical incidents, power outages, and other unforeseen situations, providing necessary support."
        ]
      },
      {
        "category": "Access Control and Monitoring",
        "items": [
          "Lock doors and restrict access to unauthorized areas to maintain order and security.",
          "Conduct routine searches of facilities when necessary to ensure safety and compliance with protocols."
        ]
      },
      {
        "category": "Conflict Resolution",
        "items": [
          "Deter, deescalate, and resolve any security issues that may arise during events or services.",
          "Maintain a calm and professional demeanour to manage conflicts effectively."
        ]
      },
      {
        "category": "Facility Supervision",
        "items": [
          "Act as facility supervisor, ensuring all equipment and areas are in proper working condition.",
          "Execute equipment checks before going on duty to confirm readiness and reliability."
        ]
      },
      {
        "category": "Collaboration with State Security",
        "items": [
          "Maintain a working relationship with state security agencies to ensure maximum security and adherence to legal protocols.",
          "Coordinate with external security personnel when necessary for large events or special operations."
        ]
      },
      {
        "category": "Assigned Post Maintenance",
        "items": [
          "Remain at assigned posts to monitor activities and provide assistance as needed.",
          "Ensure visibility and accessibility to attendees, offering reassurance and support."
        ]
      }
    ],
    "keyAttributes": [
      "Vigilant, observant, and proactive in identifying potential risks.",
      "Strong interpersonal and conflict-resolution skills.",
      "Calm and professional under pressure, especially during emergencies.",
      "Commitment to maintaining the safety and well-being of members and guests.",
      "Physically fit and prepared to handle security-related tasks."
    ],
    "headOfDepartment": {
      "title": "Head of Security Department (Chief Security Officer)",
      "summary": "The Head of the Security Department (Chief Security Officer) oversees all security operations within the ministry, ensuring the safety of lives, properties, and facilities. Reporting directly to the ministry’s leadership, the Chief Security Officer leads the team in implementing security protocols, addressing risks, and managing emergency responses. This role requires strategic planning, leadership, and collaboration with both internal personnel and external security agencies.",
      "responsibilities": [
        {
          "category": "Leadership and Supervision",
          "items": [
            "Provide leadership and direction for all security personnel, ensuring all duties are performed effectively and professionally.",
            "Assign team members to posts and monitor their performance during services and events."
          ]
        },
        {
          "category": "Risk Assessment and Mitigation",
          "items": [
            "Identify potential security risks and implement measures to mitigate them.",
            "Conduct regular facility inspections to ensure the safety of attendees and property."
          ]
        },
        {
          "category": "Emergency Response Coordination",
          "items": [
            "Lead the department’s response to emergencies, including medical incidents, power outages, or security threats.",
            "Collaborate with other departments to provide comprehensive support during emergencies."
          ]
        },
        {
          "category": "Access and Facility Control",
          "items": [
            "Oversee access control measures, including the locking of doors and restricted areas.",
            "Ensure routine searches are conducted when necessary to maintain a safe environment."
          ]
        },
        {
          "category": "Collaboration with External Agencies",
          "items": [
            "Maintain a strong working relationship with state security agencies and other external bodies.",
            "Coordinate security efforts for large-scale events requiring external support."
          ]
        },
        {
          "category": "Conflict Resolution and Incident Reporting",
          "items": [
            "Handle conflicts or disturbances calmly, de-escalating situations as needed.",
            "Prepare and submit detailed reports on incidents, suspicious activities, and resolutions to ministry leadership."
          ]
        },
        {
          "category": "Training and Team Development",
          "items": [
            "Train security personnel on safety protocols, conflict resolution, and emergency response.",
            "Promote a culture of vigilance, professionalism, and teamwork within the department."
          ]
        },
        {
          "category": "Equipment and Resource Management",
          "items": [
            "Ensure all security equipment is in proper working condition and conduct pre-duty checks.",
            "Recommend improvements or upgrades to enhance the department’s operational efficiency."
          ]
        },
        {
          "category": "Reporting",
          "items": [
            "Provide regular updates and reports to the Administrator on departmental activities.",
            "Present reports at meetings"
          ]
        },
        {
          "category": "Additional Responsibilities",
          "items": [
            "Undertake other tasks as assigned by ministry leadership to support the overall safety and security objectives."
          ]
        }
      ],
      "kpis": [
        "Effectiveness in mitigating security risks and addressing incidents.",
        "Timely response to emergencies and support provided during events.",
        "Positive feedback from attendees and leadership on safety and security measures.",
        "Compliance with legal and safety standards in all security operations.",
        "Growth and professionalism within the Security Department."
      ],
      "qualifications": [
        "Proven experience in security operations, leadership, or a related field.",
        "Strong organizational and strategic planning abilities.",
        "Excellent communication and interpersonal skills.",
        "Physical fitness and readiness to respond to emergencies.",
        "Knowledge of security protocols and collaboration with external security agencies."
      ]
    }
  },
  "children": {
    "departmentName": "Children/Teenage Ministry",
    "overview": "Children/Teenage Ministry The Children/Teenage Ministry is a vital arm of URPN focused on nurturing children and teenagers into godly individuals from a tender age. The department provides spiritual, moral, and social guidance to help young people grow in their faith and character. This ministry operates in alignment with the URPN policy document and is led by the Head of Department (HOD), Children/Teenage Ministry, referred to as the Children/Teenage Pastor.",
    "responsibilities": [
      {
        "category": "Spiritual Development",
        "items": [
          "Design and implement programs that foster spiritual growth and biblical understanding for children and teenagers.",
          "Organize regular worship sessions, Bible studies, and prayer meetings tailored to young audiences."
        ]
      },
      {
        "category": "Activities",
        "items": [
          "Develop age-appropriate lesson plans, teaching materials, and activities that align with the ministry’s vision.",
          "Incorporate creative methods such as storytelling, games, and crafts to engage children and teenagers.",
          "Plan and execute special events for children and teenagers, including camps, retreats, and holiday programs.",
          "Coordinate participation in ministry-wide events and ensure age-appropriate content for young attendees."
        ]
      },
      {
        "category": "Mentorship and Counseling",
        "items": [
          "Provide mentorship and spiritual counseling to children and teenagers, addressing their personal and spiritual challenges.",
          "Encourage positive character development and godly behavior through consistent teaching and guidance.",
          "Work with parents, guardians, and every department necessary to create a supportive environment for young people.",
          "Partner with the Prayer and Counseling units to address specific needs of children and teenagers."
        ]
      }
    ],
    "keyAttributes": [
      "Passion for working with children and teenagers.",
      "Creativity and adaptability in teaching and programming.",
      "Strong interpersonal and communication skills.",
      "A commitment to spiritual and moral growth.",
      "Ability to maintain a safe and nurturing environment."
    ],
    "headOfDepartment": {
      "title": "Head of Department (Children/Teenage Pastor)",
      "summary": "The Head of Department (HOD), Children/Teenage Ministry, referred to as the Children Pastor, leads the ministry’s efforts to nurture and disciple children and teenagers. Reporting to the Administrator, the Children Pastor ensures the spiritual, moral, and social growth of young people while overseeing the department's activities, volunteers, and compliance with ministry policies.",
      "responsibilities": [
        {
          "category": "Leadership and Oversight",
          "items": [
            "Provide strategic leadership for the Children/Teenage Ministry, ensuring all activities align with URPN’s mission and vision.",
            "Supervise and mentor volunteers, equipping them to support children and teenagers effectively.",
            "Ensure all departmental activities comply with URPN policies and child protection guidelines.",
            "Create a safe, nurturing environment for children and teenagers in all programs.",
            "Ensure all departmental activities comply with URPN policies and child protection guidelines.",
            "Create a safe, nurturing environment for children and teenagers in all programs.",
            "Recruit, train, and supervise volunteers, ensuring they understand their roles and responsibilities.",
            "Facilitate regular training sessions to improve the skills and effectiveness of team members."
          ]
        },
        {
          "category": "Spiritual and Educational Development",
          "items": [
            "Oversee the design and implementation of lesson plans, teaching materials, and programs.",
            "Ensure all teachings and activities foster spiritual growth, moral integrity, and biblical knowledge.",
            "Lead the planning and execution of special events, camps, and retreats for children and teenagers.",
            "Collaborate with other departments to integrate young people into ministry-wide programs."
          ]
        },
        {
          "category": "Reporting",
          "items": [
            "Report departmental progress, challenges, and outcomes to the Administrator",
            "Present report at meetings"
          ]
        },
        {
          "category": "Future Planning",
          "items": [
            "Anticipate future needs and opportunities for the department, developing strategies to address them.",
            "Innovate and adapt programs to meet the evolving needs of children and teenagers."
          ]
        },
        {
          "category": "Additional Responsibilities",
          "items": [
            "Perform other tasks assigned by the Administrator or Governing Council to support the ministry’s objectives."
          ]
        }
      ],
      "kpis": [
        "Growth in the spiritual maturity and engagement of children and teenagers.",
        "Positive feedback from parents, volunteers, and ministry leadership.",
        "Successful planning and execution of events and programs.",
        "Compliance with ministry policies and child protection standards.",
        "Effective mentorship and development of volunteers."
      ],
      "qualifications": [
        "Proven experience in children or youth ministry leadership.",
        "Strong teaching, mentoring, and interpersonal skills.",
        "Creativity and innovation in program development.",
        "A deep understanding of biblical principles and child development.",
        "Ability to lead and inspire a team of volunteers."
      ]
    }
  },
  "publications": {
    "departmentName": "Publications & Academic Department",
    "overview": "The Publications (Library, Bookshop, Printing Press) and Academic Department serves as the intellectual and literature repository of URPN. It coordinates research, production, publication, book distribution, and academic development.",
    "responsibilities": [
      {
        "category": "Publishing and Knowledge Repository",
        "items": [
          "Development of Publishing Ministries Department Policy",
          "Typeset and publish unit Reports from the Field, activities, and Literature from the unit's Seminaries and training.",
          "Serve as Development and Resource Center for URPN",
          "Attend Publishing House Board Meetings (Where possible and necessary)",
          "Sell/market books in different formats.",
          "Manage the library (both traditional and virtual) resources.",
          "Performing full knowledge repository functions of introspect and retrospect organisation of literatures (indigenous and outsourced materials).",
          "Assist in Securing Publication Rights, Manuscripts, and Materials for Publications",
          "Coordinate the Production and Circulation of the ministry’s Literature.",
          "And other duties from the Governing Council."
        ]
      }
    ],
    "keyAttributes": [
      "Commitment to academic and intellectual excellence.",
      "High organizational and library management abilities.",
      "Integrity in handling manuscripts, publications, and financial records.",
      "Strong communication and mentorship skills.",
      "Passion for research, Christian literature, and publishing."
    ],
    "headOfDepartment": {
      "title": "Head of Academic Department",
      "summary": "The Head of Academic Department (HOD) leads the ministry’s efforts to support educational growth, academic excellence, and intellectual development among members. This role involves designing and overseeing programs, resources, and initiatives that empower individuals to excel academically while fostering a Christ-centered approach to education. Reporting to the Administrator, the HOD ensures alignment with the ministry’s vision and values.",
      "responsibilities": [
        {
          "category": "Leadership and Strategic Direction",
          "items": [
            "Provide visionary leadership for the Academic Department, ensuring all activities align with the ministry’s mission to promote spiritual and intellectual development.",
            "Establish and oversee department goals, objectives, and key performance indicators (KPIs) to measure success.",
            "Design and implement educational programs, workshops, and seminars to enhance academic performance and learning skills for members.",
            "Organize tutoring sessions, scholarship opportunities, and career development programs to support members at various educational levels."
          ]
        },
        {
          "category": "Resource Creation and Distribution",
          "items": [
            "Develop and distribute study guides, learning resources, and other educational materials that encourage both academic and spiritual growth.",
            "Identify and share tools, platforms, and opportunities for furthering education and intellectual development."
          ]
        },
        {
          "category": "Mentorship and Academic Counseling",
          "items": [
            "Provide mentorship and academic counseling to members, helping them navigate challenges in their studies and careers.",
            "Assist students in setting academic goals and developing strategies for success."
          ]
        },
        {
          "category": "Collaboration and Partnerships",
          "items": [
            "Collaborate with external organizations, schools, and institutions to create opportunities for academic advancement and professional development.",
            "Work with other departments to integrate academic programs into ministry-wide events and initiatives."
          ]
        },
        {
          "category": "Volunteer and Team Development",
          "items": [
            "Recruit, train, and supervise volunteers and team members to support the department’s programs and initiatives.",
            "Facilitate regular training sessions to enhance the skills and effectiveness of team members."
          ]
        },
        {
          "category": "Data and Progress Monitoring",
          "items": [
            "Maintain accurate records of departmental activities, including program attendance, member progress, and academic outcomes.",
            "Analyze data to identify areas for improvement and develop strategies to address challenges."
          ]
        },
        {
          "category": "Event Planning and Execution",
          "items": [
            "Organize and lead academic-focused events, such as workshops, career fairs, and educational conferences.",
            "Ensure events are well-coordinated and impactful, providing attendees with valuable insights and opportunities."
          ]
        },
        {
          "category": "Reporting and Communication",
          "items": [
            "Report departmental activities, outcomes, and challenges to the Administrator and Governing Council as required.",
            "Communicate effectively with members to promote programs and resources offered by the department."
          ]
        },
        {
          "category": "Additional Responsibilities",
          "items": [
            "Perform other tasks assigned by the Administrator or Governing Council to support the ministry’s academic goals."
          ]
        }
      ],
      "kpis": [
        "Successful implementation of academic programs and events.",
        "Positive feedback from members regarding departmental initiatives and resources.",
        "Growth in academic performance and intellectual engagement among members.",
        "Effective collaboration with external partners and institutions.",
        "Timely and accurate reporting of departmental activities and outcomes."
      ],
      "qualifications": [
        "Strong background in education, academic administration, or a related field.",
        "Proven leadership and program management experience.",
        "Excellent interpersonal, mentorship, and communication skills.",
        "Ability to create and manage educational resources and programs.",
        "Commitment to fostering both academic excellence and spiritual growth."
      ]
    }
  },
  "drama": {
    "departmentName": "Drama and Demonstration Department",
    "overview": "Drama and Demonstration Department The Drama and Demonstration Department is a creative arm of URPN that communicates the gospel through dramatic arts, storytelling, and visual demonstrations. This department uses skits, plays, choreographies, and other creative expressions to illustrate biblical truths and reinforce the ministry's teachings. It operates under the leadership of the Head of Department (HOD) to enhance the spiritual and emotional impact of services and events.",
    "responsibilities": [
      {
        "category": "Creative Evangelism",
        "items": [
          "Develop and perform drama, skits, and visual demonstrations that communicate the gospel message effectively.",
          "Use creativity to present biblical truths in ways that engage, inspire, and educate the audience.",
          "Provide dramatic and visual support during ministry programs, conferences, and outreach events."
        ]
      },
      {
        "category": "Content Development",
        "items": [
          "Write scripts, design storylines, and choreograph performances that align with the ministry’s vision and themes.",
          "Ensure all presentations are biblically sound, culturally relevant, and aligned with ministry policies."
        ]
      },
      {
        "category": "Resource and Equipment Management",
        "items": [
          "Manage costumes, props, and stage equipment required for performances.",
          "Maintain an inventory of resources and ensure they are in good condition for use."
        ]
      },
      {
        "category": "Community Engagement",
        "items": [
          "Use drama as a tool for outreach to engage the local community and share the gospel message.",
          "Participate in community events and represent the ministry through dramatic arts.."
        ]
      },
      {
        "category": "Additional Responsibilities",
        "items": [
          "Undertake other tasks assigned by the ministry leadership to support its vision through dramatic arts."
        ]
      }
    ],
    "keyAttributes": [
      "Passion for drama and creative arts as tools for ministry.",
      "Strong teamwork and collaboration skills.",
      "Creativity and adaptability in content development.",
      "Commitment to excellence and spiritual growth.",
      "Punctuality and discipline in rehearsal and performance schedules."
    ],
    "headOfDepartment": {
      "title": "Head of Drama and Demonstration Department (HOD)",
      "summary": "The Head of Department (HOD) provides leadership, direction, and vision for the department. This role involves overseeing the creation and execution of dramatic presentations, ensuring they align with the ministry’s teachings and goals. The HOD manages the team, develops content, and collaborates with other departments to maximize the impact of performances. Reporting to the Administrator, the HOD plays a critical role in using creative arts to inspire and educate the congregation and participants at events and services .",
      "responsibilities": [
        {
          "category": "Leadership and Oversight",
          "items": [
            "Lead the Drama and Demonstration Department, ensuring all activities align with the ministry’s vision and goals.",
            "Mentor and guide team members, fostering a culture of creativity and excellence.",
            "Recruit, train, and supervise team members to enhance their skills in acting, directing, and production.",
            "Organize workshops and training sessions to encourage creativity and professional growth.",
            "Plan and execute performances for services, conferences, and outreach events.",
            "Ensure that performances are engaging, impactful, and delivered with excellence."
          ]
        },
        {
          "category": "Content and Script Development",
          "items": [
            "Oversee the creation of scripts, storylines, and choreography for dramatic performances.",
            "Ensure all content is biblically sound and aligns with the ministry’s teachings and themes."
          ]
        },
        {
          "category": "Resource Management",
          "items": [
            "Oversee the management of costumes, props, and stage equipment.",
            "Ensure resources are well-maintained and available for use during performances."
          ]
        },
        {
          "category": "Reporting and Administration",
          "items": [
            "Report departmental activities, progress, and challenges to the Administrator.",
            "Maintain records of scripts, performances, and team activities for future reference."
          ]
        },
        {
          "category": "Additional Responsibilities",
          "items": [
            "Undertake other tasks assigned by the ministry leadership to enhance the use of dramatic arts in fulfilling the ministry’s vision."
          ]
        }
      ],
      "kpis": [
        "Positive feedback on the spiritual and emotional impact of performances.",
        "Growth in team skills and performance quality.",
        "Successful integration of drama into services, events, and outreach programs.",
        "Effective management of resources, schedules, and rehearsals.",
        "Alignment of all activities with the ministry’s vision and teachings."
      ],
      "qualifications": [
        "Strong leadership and organizational skills.",
        "Creativity and expertise in scriptwriting, directing, and stage management.",
        "Excellent communication and interpersonal abilities.",
        "Commitment to spiritual growth and the use of drama for ministry.",
        "Proven experience in dramatic arts or a related field."
      ]
    }
  }
};
