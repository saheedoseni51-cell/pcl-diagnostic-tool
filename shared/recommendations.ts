/**
 * Recommendations engine for PCL 3x3 assessment results
 * Provides personalized guidance and action items based on maturity levels
 */

export type MaturityLevel = "Nascent" | "Emerging" | "Established" | "Advanced" | "Leading";

export interface Recommendation {
  title: string;
  description: string;
  actionItems: string[];
  priority: "high" | "medium" | "low";
  timeframe: string;
}

export interface CategoryRecommendations {
  category: string;
  dimension: string;
  maturityLevel: MaturityLevel;
  currentScore: number;
  recommendations: Recommendation[];
  nextLevelGuidance?: string;
}

/**
 * Comprehensive recommendations for all 9 categories across 5 maturity levels
 */
const recommendationsDatabase: Record<string, Record<MaturityLevel, Recommendation[]>> = {
  // ORGANISATION DIMENSION
  "Organisation-Goals": {
    Nascent: [
      {
        title: "Establish Clear Organisational Direction",
        description:
          "Your organisation lacks clear, documented goals and strategic direction. This is the foundation for all other capabilities.",
        actionItems: [
          "Conduct a strategic planning workshop with leadership to define 3-5 year vision",
          "Document core values and mission statement",
          "Create a simple one-page strategic plan visible to all staff",
          "Establish quarterly business review cycles",
        ],
        priority: "high",
        timeframe: "0-3 months",
      },
    ],
    Emerging: [
      {
        title: "Strengthen Goal Alignment Across Teams",
        description:
          "You have some goals in place, but they may not be consistently understood or aligned across the organisation.",
        actionItems: [
          "Cascade strategic goals to department and team levels",
          "Implement OKR (Objectives and Key Results) framework",
          "Create visual goal dashboards accessible to all teams",
          "Establish monthly all-hands meetings to review progress",
        ],
        priority: "high",
        timeframe: "1-3 months",
      },
    ],
    Established: [
      {
        title: "Enhance Goal Measurement and Accountability",
        description:
          "Your goals are clear and mostly aligned, but measurement and accountability mechanisms need strengthening.",
        actionItems: [
          "Implement balanced scorecard approach with leading and lagging indicators",
          "Link individual performance goals to organisational objectives",
          "Establish monthly goal tracking and review meetings",
          "Create feedback loops for goal adjustment based on market changes",
        ],
        priority: "medium",
        timeframe: "1-2 months",
      },
    ],
    Advanced: [
      {
        title: "Optimize Goal Agility and Responsiveness",
        description:
          "Your goals are well-defined and tracked, but could be more responsive to market changes and emerging opportunities.",
        actionItems: [
          "Implement quarterly goal review cycles with market analysis",
          "Create rapid response protocols for strategic pivots",
          "Develop scenario planning for different market conditions",
          "Establish innovation pipeline aligned with strategic goals",
        ],
        priority: "medium",
        timeframe: "2-3 months",
      },
    ],
    Leading: [
      {
        title: "Maintain Strategic Excellence and Innovation",
        description:
          "Your organisation has exemplary goal-setting practices. Focus on continuous innovation and stakeholder engagement.",
        actionItems: [
          "Regularly benchmark against industry leaders",
          "Engage customers and stakeholders in goal co-creation",
          "Invest in emerging technology and trend monitoring",
          "Share best practices with industry peers",
        ],
        priority: "low",
        timeframe: "Ongoing",
      },
    ],
  },

  "Organisation-Structure": {
    Nascent: [
      {
        title: "Establish Clear Organisational Structure",
        description:
          "Your organisation lacks a clear structure, leading to confusion about roles, responsibilities, and decision-making authority.",
        actionItems: [
          "Create an organisational chart with clear reporting lines",
          "Define roles and responsibilities for each position",
          "Document decision-making authority at each level",
          "Communicate structure to all employees",
        ],
        priority: "high",
        timeframe: "0-2 months",
      },
    ],
    Emerging: [
      {
        title: "Clarify and Optimize Organisational Roles",
        description:
          "You have a basic structure, but role clarity and cross-functional collaboration need improvement.",
        actionItems: [
          "Conduct role clarity workshops with each team",
          "Create RACI matrices for key processes",
          "Establish cross-functional working groups",
          "Document and communicate updated org structure",
        ],
        priority: "high",
        timeframe: "1-2 months",
      },
    ],
    Established: [
      {
        title: "Enhance Structural Flexibility and Collaboration",
        description:
          "Your structure is clear but may be too rigid. Consider more flexible, matrix-based approaches.",
        actionItems: [
          "Implement matrix management for cross-functional projects",
          "Create flexible team structures for innovation initiatives",
          "Establish communities of practice across departments",
          "Review and update org structure annually",
        ],
        priority: "medium",
        timeframe: "2-3 months",
      },
    ],
    Advanced: [
      {
        title: "Evolve to Adaptive Organisational Design",
        description:
          "Your structure is effective. Consider more adaptive, network-based approaches for greater agility.",
        actionItems: [
          "Pilot agile or holacracy principles in select teams",
          "Implement dynamic team formation for projects",
          "Create fluid role definitions that evolve with needs",
          "Establish network-based collaboration platforms",
        ],
        priority: "medium",
        timeframe: "3-6 months",
      },
    ],
    Leading: [
      {
        title: "Pioneer Next-Generation Organisational Models",
        description:
          "Your structure is exemplary. Continue innovating with emerging organisational paradigms.",
        actionItems: [
          "Explore and pilot emerging org models (e.g., teal organisations)",
          "Create self-managing teams with clear purpose",
          "Implement real-time decision-making frameworks",
          "Share structural innovations with industry",
        ],
        priority: "low",
        timeframe: "Ongoing",
      },
    ],
  },

  "Organisation-Management": {
    Nascent: [
      {
        title: "Establish Basic Management Practices",
        description:
          "Your organisation lacks consistent management practices, leading to inconsistent decision-making and performance.",
        actionItems: [
          "Establish regular 1-on-1 meetings between managers and direct reports",
          "Create a basic performance management process",
          "Develop a management code of conduct",
          "Provide basic management training to all leaders",
        ],
        priority: "high",
        timeframe: "0-3 months",
      },
    ],
    Emerging: [
      {
        title: "Professionalize Management Practices",
        description:
          "You have some management practices, but they need standardization and consistency across the organisation.",
        actionItems: [
          "Implement consistent performance review cycles",
          "Create management competency framework",
          "Establish leadership development program",
          "Implement 360-degree feedback for managers",
        ],
        priority: "high",
        timeframe: "1-3 months",
      },
    ],
    Established: [
      {
        title: "Enhance Management Effectiveness and Development",
        description:
          "Your management practices are solid. Focus on continuous improvement and manager development.",
        actionItems: [
          "Implement coaching and mentoring programs for managers",
          "Create peer learning groups for leadership development",
          "Establish management metrics and dashboards",
          "Conduct annual management effectiveness reviews",
        ],
        priority: "medium",
        timeframe: "2-3 months",
      },
    ],
    Advanced: [
      {
        title: "Develop Transformational Leadership",
        description:
          "Your management practices are effective. Evolve toward transformational and adaptive leadership.",
        actionItems: [
          "Implement executive coaching for senior leaders",
          "Create succession planning and talent pipeline",
          "Develop change management capabilities",
          "Establish strategic leadership forums",
        ],
        priority: "medium",
        timeframe: "3-6 months",
      },
    ],
    Leading: [
      {
        title: "Model Exemplary Leadership Excellence",
        description:
          "Your management practices are world-class. Continue setting industry standards.",
        actionItems: [
          "Develop thought leadership and external visibility",
          "Create innovation labs led by senior leaders",
          "Establish mentoring relationships with external peers",
          "Publish and share leadership insights",
        ],
        priority: "low",
        timeframe: "Ongoing",
      },
    ],
  },

  // PROCESS DIMENSION
  "Process-Goals": {
    Nascent: [
      {
        title: "Define Key Business Processes",
        description:
          "Your organisation lacks defined processes, leading to inefficiency and inconsistency in how work gets done.",
        actionItems: [
          "Identify and map 5-10 critical business processes",
          "Document current process flows with swim lanes",
          "Identify process owners for each critical process",
          "Create simple process documentation",
        ],
        priority: "high",
        timeframe: "1-3 months",
      },
    ],
    Emerging: [
      {
        title: "Establish Process Standards and Metrics",
        description:
          "You have some processes defined, but they lack clear standards, metrics, and continuous improvement mechanisms.",
        actionItems: [
          "Define process performance metrics (KPIs) for each process",
          "Establish process standards and best practices",
          "Create process documentation repository",
          "Implement basic process monitoring",
        ],
        priority: "high",
        timeframe: "1-2 months",
      },
    ],
    Established: [
      {
        title: "Optimize Process Efficiency and Effectiveness",
        description:
          "Your processes are defined and monitored. Focus on optimization and continuous improvement.",
        actionItems: [
          "Conduct process efficiency reviews quarterly",
          "Implement lean or Six Sigma methodologies",
          "Establish process improvement teams",
          "Automate manual process steps where possible",
        ],
        priority: "medium",
        timeframe: "2-4 months",
      },
    ],
    Advanced: [
      {
        title: "Enable Process Agility and Innovation",
        description:
          "Your processes are efficient. Make them more adaptive and responsive to change.",
        actionItems: [
          "Implement agile process management approaches",
          "Create rapid process redesign capabilities",
          "Establish innovation sprints for process improvement",
          "Implement real-time process monitoring and alerts",
        ],
        priority: "medium",
        timeframe: "3-6 months",
      },
    ],
    Leading: [
      {
        title: "Pioneer Process Excellence and Transformation",
        description:
          "Your processes are exemplary. Continue driving industry-leading innovation.",
        actionItems: [
          "Explore AI and automation for process optimization",
          "Implement predictive process analytics",
          "Create process innovation labs",
          "Share process innovations with industry peers",
        ],
        priority: "low",
        timeframe: "Ongoing",
      },
    ],
  },

  "Process-Structure": {
    Nascent: [
      {
        title: "Build Process Infrastructure",
        description:
          "Your organisation lacks the infrastructure to support consistent process execution.",
        actionItems: [
          "Implement basic process management tools or systems",
          "Create process documentation standards",
          "Establish process governance structure",
          "Train staff on process documentation and execution",
        ],
        priority: "high",
        timeframe: "1-3 months",
      },
    ],
    Emerging: [
      {
        title: "Strengthen Process Governance and Control",
        description:
          "You have basic infrastructure, but governance and control mechanisms need strengthening.",
        actionItems: [
          "Establish process governance committee",
          "Implement process audit and compliance mechanisms",
          "Create process change control procedures",
          "Implement process performance dashboards",
        ],
        priority: "high",
        timeframe: "1-2 months",
      },
    ],
    Established: [
      {
        title: "Enhance Process Integration and Automation",
        description:
          "Your process infrastructure is solid. Focus on integration and automation.",
        actionItems: [
          "Integrate processes across systems and departments",
          "Automate routine process steps",
          "Implement workflow management systems",
          "Create process exception handling procedures",
        ],
        priority: "medium",
        timeframe: "2-4 months",
      },
    ],
    Advanced: [
      {
        title: "Implement Intelligent Process Management",
        description:
          "Your infrastructure is advanced. Leverage AI and analytics for optimization.",
        actionItems: [
          "Implement process mining and analytics",
          "Use AI for process optimization recommendations",
          "Create self-healing process capabilities",
          "Implement predictive process analytics",
        ],
        priority: "medium",
        timeframe: "3-6 months",
      },
    ],
    Leading: [
      {
        title: "Lead Process Innovation and Excellence",
        description:
          "Your infrastructure is world-class. Continue setting new standards.",
        actionItems: [
          "Explore quantum computing applications for processes",
          "Implement autonomous process management",
          "Create process innovation partnerships",
          "Publish process management research",
        ],
        priority: "low",
        timeframe: "Ongoing",
      },
    ],
  },

  "Process-Management": {
    Nascent: [
      {
        title: "Establish Process Ownership and Accountability",
        description:
          "Processes lack clear ownership and accountability, leading to confusion and inconsistent execution.",
        actionItems: [
          "Assign process owners for each critical process",
          "Define process owner responsibilities",
          "Create process management job descriptions",
          "Establish process review meetings",
        ],
        priority: "high",
        timeframe: "0-2 months",
      },
    ],
    Emerging: [
      {
        title: "Develop Process Management Capabilities",
        description:
          "You have process owners, but they lack the skills and tools to effectively manage processes.",
        actionItems: [
          "Provide process management training",
          "Implement process management tools",
          "Create process management standards",
          "Establish process improvement training program",
        ],
        priority: "high",
        timeframe: "1-3 months",
      },
    ],
    Established: [
      {
        title: "Advance Process Management Maturity",
        description:
          "Your process management is solid. Focus on continuous improvement and capability development.",
        actionItems: [
          "Implement process management certification program",
          "Create process management center of excellence",
          "Establish process benchmarking program",
          "Implement advanced process analytics",
        ],
        priority: "medium",
        timeframe: "2-4 months",
      },
    ],
    Advanced: [
      {
        title: "Enable Adaptive Process Management",
        description:
          "Your process management is effective. Make it more adaptive and responsive.",
        actionItems: [
          "Implement agile process management approaches",
          "Create rapid process adaptation capabilities",
          "Establish process innovation teams",
          "Implement real-time process optimization",
        ],
        priority: "medium",
        timeframe: "3-6 months",
      },
    ],
    Leading: [
      {
        title: "Champion Process Management Excellence",
        description:
          "Your process management is exemplary. Continue driving innovation and excellence.",
        actionItems: [
          "Develop thought leadership in process management",
          "Create process management partnerships",
          "Establish industry process management standards",
          "Share best practices and innovations",
        ],
        priority: "low",
        timeframe: "Ongoing",
      },
    ],
  },

  // PEOPLE DIMENSION
  "People-Goals": {
    Nascent: [
      {
        title: "Define People and Talent Strategy",
        description:
          "Your organisation lacks a clear people strategy, leading to talent gaps and engagement issues.",
        actionItems: [
          "Conduct talent needs analysis",
          "Define talent strategy and goals",
          "Identify critical roles and competencies",
          "Create workforce planning framework",
        ],
        priority: "high",
        timeframe: "1-3 months",
      },
    ],
    Emerging: [
      {
        title: "Strengthen Talent Alignment and Development",
        description:
          "You have a basic people strategy, but alignment and development mechanisms need strengthening.",
        actionItems: [
          "Implement competency framework",
          "Create talent development plans",
          "Establish learning and development programs",
          "Implement succession planning",
        ],
        priority: "high",
        timeframe: "1-3 months",
      },
    ],
    Established: [
      {
        title: "Enhance Talent Engagement and Retention",
        description:
          "Your people strategy is clear. Focus on engagement, retention, and continuous development.",
        actionItems: [
          "Implement employee engagement surveys",
          "Create retention programs for high performers",
          "Establish mentoring and coaching programs",
          "Implement career development frameworks",
        ],
        priority: "medium",
        timeframe: "2-3 months",
      },
    ],
    Advanced: [
      {
        title: "Build High-Performance Culture",
        description:
          "Your people strategy is effective. Focus on creating a high-performance culture.",
        actionItems: [
          "Implement performance management excellence",
          "Create innovation and entrepreneurship programs",
          "Establish leadership development pipeline",
          "Implement employee wellness programs",
        ],
        priority: "medium",
        timeframe: "3-6 months",
      },
    ],
    Leading: [
      {
        title: "Model Exemplary People Leadership",
        description:
          "Your people strategy is world-class. Continue setting industry standards.",
        actionItems: [
          "Develop employer brand and reputation",
          "Create talent attraction and retention excellence",
          "Establish thought leadership in people management",
          "Share best practices with industry",
        ],
        priority: "low",
        timeframe: "Ongoing",
      },
    ],
  },

  "People-Structure": {
    Nascent: [
      {
        title: "Establish Talent Management Infrastructure",
        description:
          "Your organisation lacks the infrastructure to support effective talent management.",
        actionItems: [
          "Implement HR systems and tools",
          "Create talent management processes",
          "Establish HR governance structure",
          "Develop HR policies and procedures",
        ],
        priority: "high",
        timeframe: "1-3 months",
      },
    ],
    Emerging: [
      {
        title: "Strengthen Talent Management Processes",
        description:
          "You have basic HR infrastructure, but talent management processes need strengthening.",
        actionItems: [
          "Implement recruitment and onboarding processes",
          "Create performance management system",
          "Establish learning management system",
          "Implement compensation and benefits management",
        ],
        priority: "high",
        timeframe: "1-3 months",
      },
    ],
    Established: [
      {
        title: "Optimize Talent Management Systems",
        description:
          "Your talent management infrastructure is solid. Focus on optimization and integration.",
        actionItems: [
          "Integrate HR systems and data",
          "Implement analytics for talent insights",
          "Create self-service HR capabilities",
          "Implement talent marketplace platforms",
        ],
        priority: "medium",
        timeframe: "2-4 months",
      },
    ],
    Advanced: [
      {
        title: "Enable Intelligent Talent Management",
        description:
          "Your talent infrastructure is advanced. Leverage AI and analytics for optimization.",
        actionItems: [
          "Implement AI-powered recruitment",
          "Use predictive analytics for talent planning",
          "Create personalized learning paths",
          "Implement skills-based organization",
        ],
        priority: "medium",
        timeframe: "3-6 months",
      },
    ],
    Leading: [
      {
        title: "Pioneer Next-Generation Talent Management",
        description:
          "Your talent infrastructure is world-class. Continue driving innovation.",
        actionItems: [
          "Explore emerging talent technologies",
          "Implement autonomous talent management",
          "Create talent innovation labs",
          "Lead industry talent management standards",
        ],
        priority: "low",
        timeframe: "Ongoing",
      },
    ],
  },

  "People-Management": {
    Nascent: [
      {
        title: "Establish People Management Practices",
        description:
          "Your organisation lacks consistent people management practices, leading to inconsistent employee experiences.",
        actionItems: [
          "Establish regular team meetings and communication",
          "Create basic performance feedback processes",
          "Develop people management guidelines",
          "Provide basic people management training",
        ],
        priority: "high",
        timeframe: "0-3 months",
      },
    ],
    Emerging: [
      {
        title: "Professionalize People Management",
        description:
          "You have some people management practices, but they need standardization and consistency.",
        actionItems: [
          "Implement consistent feedback and recognition",
          "Create people management competency framework",
          "Establish employee engagement programs",
          "Implement conflict resolution processes",
        ],
        priority: "high",
        timeframe: "1-3 months",
      },
    ],
    Established: [
      {
        title: "Enhance People Development and Engagement",
        description:
          "Your people management practices are solid. Focus on development and engagement.",
        actionItems: [
          "Implement coaching and mentoring programs",
          "Create peer learning and collaboration",
          "Establish wellness and wellbeing programs",
          "Implement employee recognition programs",
        ],
        priority: "medium",
        timeframe: "2-3 months",
      },
    ],
    Advanced: [
      {
        title: "Build Exceptional People Leadership",
        description:
          "Your people management is effective. Focus on creating exceptional experiences.",
        actionItems: [
          "Implement personalized development plans",
          "Create innovation and autonomy programs",
          "Establish purpose-driven work initiatives",
          "Implement holistic wellbeing programs",
        ],
        priority: "medium",
        timeframe: "3-6 months",
      },
    ],
    Leading: [
      {
        title: "Model Exemplary People Leadership",
        description:
          "Your people management is world-class. Continue setting industry standards.",
        actionItems: [
          "Develop employer brand and reputation",
          "Create talent attraction excellence",
          "Establish thought leadership in people management",
          "Share best practices with industry peers",
        ],
        priority: "low",
        timeframe: "Ongoing",
      },
    ],
  },
};

/**
 * Get recommendations for a specific category and maturity level
 */
export function getRecommendations(
  category: string,
  dimension: string,
  maturityLevel: MaturityLevel,
  score: number
): CategoryRecommendations {
  const key = `${dimension}-${category}`;
  const recommendations = recommendationsDatabase[key]?.[maturityLevel] || [];

  // Determine next level guidance
  let nextLevelGuidance: string | undefined;
  const levels: MaturityLevel[] = ["Nascent", "Emerging", "Established", "Advanced", "Leading"];
  const currentIndex = levels.indexOf(maturityLevel);

  if (currentIndex < levels.length - 1) {
    const nextLevel = levels[currentIndex + 1];
    const nextRecommendations = recommendationsDatabase[key]?.[nextLevel];
    if (nextRecommendations && nextRecommendations.length > 0) {
      nextLevelGuidance = `To reach ${nextLevel} level: ${nextRecommendations[0].title}`;
    }
  }

  return {
    category,
    dimension,
    maturityLevel,
    currentScore: score,
    recommendations,
    nextLevelGuidance,
  };
}

/**
 * Get all recommendations for a complete assessment result
 */
export function getAllRecommendations(scores: {
  organisationGoals: number;
  organisationStructure: number;
  organisationManagement: number;
  processGoals: number;
  processStructure: number;
  processManagement: number;
  peopleGoals: number;
  peopleStructure: number;
  peopleManagement: number;
}): CategoryRecommendations[] {
  const categories = [
    { dimension: "Organisation", category: "Goals", score: scores.organisationGoals },
    { dimension: "Organisation", category: "Structure", score: scores.organisationStructure },
    { dimension: "Organisation", category: "Management", score: scores.organisationManagement },
    { dimension: "Process", category: "Goals", score: scores.processGoals },
    { dimension: "Process", category: "Structure", score: scores.processStructure },
    { dimension: "Process", category: "Management", score: scores.processManagement },
    { dimension: "People", category: "Goals", score: scores.peopleGoals },
    { dimension: "People", category: "Structure", score: scores.peopleStructure },
    { dimension: "People", category: "Management", score: scores.peopleManagement },
  ];

  return categories.map(({ dimension, category, score }) => {
    // Determine maturity level from score
    let maturityLevel: MaturityLevel = "Nascent";
    if (score < 2) maturityLevel = "Nascent";
    else if (score < 3) maturityLevel = "Emerging";
    else if (score < 4) maturityLevel = "Established";
    else if (score < 4.5) maturityLevel = "Advanced";
    else maturityLevel = "Leading";

    return getRecommendations(category, dimension, maturityLevel, score);
  });
}
