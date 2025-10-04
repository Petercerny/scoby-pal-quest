import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Search, 
  Coffee, 
  Microscope, 
  Beaker, 
  ChefHat, 
  Shield, 
  Heart, 
  Zap, 
  History, 
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";

export const LibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All', icon: BookOpen },
    { id: 'basics', name: 'Basics', icon: BookOpen },
    { id: 'brewing', name: 'Brewing', icon: Beaker },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: AlertTriangle },
    { id: 'advanced', name: 'Advanced', icon: Zap },
    { id: 'health', name: 'Health', icon: Heart },
    { id: 'history', name: 'History', icon: History }
  ];

  const knowledgeModules = [
    {
      id: 'introduction',
      title: 'Introduction to Kombucha',
      icon: Coffee,
      description: 'Learn the basics of kombucha and what makes it special',
      difficulty: 'beginner',
      category: 'basics',
      content: {
        sections: [
          {
            title: 'What is Kombucha?',
            content: 'Kombucha is a fermented tea drink made with sweetened tea and a SCOBY (Symbiotic Culture of Bacteria and Yeast). During fermentation, the SCOBY converts sugar into acids, gases, and trace alcohol, creating a fizzy, tangy beverage with potential probiotic benefits.',
            type: 'text'
          }
        ]
      }
    },
    {
      id: 'scoby',
      title: 'The SCOBY',
      icon: Microscope,
      description: 'Understanding the heart of kombucha brewing',
      difficulty: 'beginner',
      category: 'basics',
      content: {
        sections: [
          {
            title: 'The Heart of Kombucha',
            content: [
              'A living culture of bacteria and yeast.',
              'Grows as a cellulose mat on the surface of the tea.',
              'Converts sugar into acids and carbonation.',
              'Needs a clean, slightly acidic environment to thrive.',
              'Can be stored in a "SCOBY hotel" when not brewing.'
            ],
            type: 'list'
          }
        ]
      }
    },
    {
      id: 'brewing-process',
      title: 'Brewing Process',
      icon: Beaker,
      description: 'Step-by-step guide to brewing kombucha',
      difficulty: 'intermediate',
      category: 'brewing',
      content: {
        sections: [
          {
            title: 'Ingredients',
            content: [
              'Tea: black, green, oolong, or blends (avoid oils/flavored teas).',
              'Sugar: white cane sugar is best.',
              'Water: filtered or spring.',
              'Starter Tea: mature kombucha from a previous batch.'
            ],
            type: 'list'
          },
          {
            title: 'First Fermentation (F1)',
            content: [
              'Brew sweet tea, let it cool.',
              'Add SCOBY + starter tea.',
              'Cover with breathable cloth.',
              'Ferment 7–14 days (shorter = sweeter, longer = tangier).'
            ],
            type: 'list'
          },
          {
            title: 'Second Fermentation (F2)',
            content: [
              'Remove SCOBY and some starter tea for next batch.',
              'Bottle kombucha with fruits, herbs, or spices.',
              'Seal tightly for 2–7 days to carbonate.',
              'Refrigerate to stop fermentation.'
            ],
            type: 'list'
          }
        ]
      }
    },
    {
      id: 'flavoring',
      title: 'Flavoring & Recipes',
      icon: ChefHat,
      description: 'Creative ways to flavor your kombucha',
      difficulty: 'intermediate',
      category: 'brewing',
      content: {
        sections: [
          {
            title: 'Get Creative with Flavors',
            content: [
              'Fruits: berries, citrus, mango.',
              'Herbs & Spices: ginger, mint, cinnamon.',
              'Sample Blends: Lemon + Lavender, Ginger + Turmeric.'
            ],
            type: 'list'
          },
          {
            title: 'Pro Tip',
            content: 'Strain before drinking if you prefer a smooth kombucha.',
            type: 'tip'
          }
        ]
      }
    },
    {
      id: 'safety-troubleshooting',
      title: 'Safety & Troubleshooting',
      icon: Shield,
      description: 'Keep your brew safe and fix common issues',
      difficulty: 'intermediate',
      category: 'troubleshooting',
      content: {
        sections: [
          {
            title: 'Safety Practices',
            content: [
              'Sanitize jars, bottles, and utensils.',
              'Keep pH below 4.6.',
              'Use clean hands when handling SCOBY.'
            ],
            type: 'list'
          },
          {
            title: 'Common Issues',
            content: [
              'Mold: Dry, fuzzy, white/green/black/blue spots → discard batch & SCOBY.',
              'No carbonation: Check bottle seal or add more sugar/fruit.',
              'Too sour: Shorten fermentation time.',
              'Too sweet: Extend fermentation time.'
            ],
            type: 'list'
          }
        ]
      }
    },
    {
      id: 'health-benefits',
      title: 'Health Benefits & Considerations',
      icon: Heart,
      description: 'Understanding the health aspects of kombucha',
      difficulty: 'intermediate',
      category: 'health',
      content: {
        sections: [
          {
            title: 'Benefits',
            content: [
              'Contains probiotics, antioxidants, organic acids.',
              'May support digestion and gut health.'
            ],
            type: 'list'
          },
          {
            title: 'Important Considerations',
            content: 'Not suitable for everyone (pregnant people, children, immunocompromised should consult a doctor). Contains caffeine and trace alcohol.',
            type: 'warning'
          }
        ]
      }
    },
    {
      id: 'advanced-brewing',
      title: 'Advanced Brewing',
      icon: Zap,
      description: 'Take your brewing to the next level',
      difficulty: 'advanced',
      category: 'advanced',
      content: {
        sections: [
          {
            title: 'Advanced Techniques',
            content: [
              'Continuous Brewing: Tap from a vessel while replenishing tea.',
              'Alternative Teas: White, oolong, pu-erh.',
              'Sugar Alternatives: Honey (jun kombucha), coconut sugar, maple syrup.',
              'Kombucha Vinegar: Over-fermented kombucha for salad dressings & marinades.'
            ],
            type: 'list'
          }
        ]
      }
    },
    {
      id: 'history-culture',
      title: 'History & Culture',
      icon: History,
      description: 'The rich history of kombucha',
      difficulty: 'beginner',
      category: 'history',
      content: {
        sections: [
          {
            title: 'Historical Timeline',
            content: [
              'Originated in Northeast China ~220 BCE.',
              'Spread to Japan, Russia, and Europe.',
              'Popularized in the West in the 20th century.',
              'Now part of a global craft beverage movement.'
            ],
            type: 'list'
          }
        ]
      }
    },
    {
      id: 'glossary',
      title: 'Glossary',
      icon: HelpCircle,
      description: 'Key terms every brewer should know',
      difficulty: 'beginner',
      category: 'basics',
      content: {
        sections: [
          {
            title: 'Essential Terms',
            content: [
              'SCOBY: Symbiotic Culture of Bacteria and Yeast.',
              'F1: First fermentation.',
              'F2: Second fermentation.',
              'Starter Tea: Mature kombucha used to lower pH.',
              'Kombucha Hotel: A jar for storing extra SCOBYs.'
            ],
            type: 'list'
          }
        ]
      }
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basics': return BookOpen;
      case 'brewing': return Beaker;
      case 'troubleshooting': return AlertTriangle;
      case 'advanced': return Zap;
      case 'health': return Heart;
      case 'history': return History;
      default: return Info;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'tip': return Lightbulb;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return CheckCircle;
    }
  };

  const filteredModules = knowledgeModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderContent = (section: any) => {
    const Icon = getContentIcon(section.type);
    
    switch (section.type) {
      case 'list':
        return (
          <ul className="space-y-2">
            {Array.isArray(section.content) && section.content.map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        );
      case 'tip':
        return (
          <div className="flex gap-2 p-2 sm:p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{section.content}</span>
          </div>
        );
      case 'warning':
        return (
          <div className="flex gap-2 p-2 sm:p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 leading-relaxed">{section.content}</span>
          </div>
        );
      case 'info':
        return (
          <div className="flex gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg border border-gray-200 dark:border-gray-800">
            <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{section.content}</span>
          </div>
        );
      default:
        return <p className="text-xs sm:text-sm leading-relaxed">{section.content}</p>;
    }
  };

  return (
    <div className="bg-background p-2 sm:p-4" style={{ minHeight: '100vh', paddingBottom: '120px' }}>
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Kombucha Knowledge Library</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            Master the art of kombucha brewing with our comprehensive guide. From basics to advanced techniques, everything you need to know is here.
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search knowledge modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">{category.name}</span>
                      <span className="xs:hidden">{category.name.charAt(0).toUpperCase()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Modules */}
        <div className="space-y-4">
          {filteredModules.length === 0 ? (
            <Card>
              <CardContent className="p-6 sm:p-8 text-center">
                <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">No modules found</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {filteredModules.map((module) => {
                const CategoryIcon = getCategoryIcon(module.category);
                const ModuleIcon = module.icon;
                
                return (
                  <AccordionItem key={module.id} value={module.id} className="border rounded-lg">
                    <Card>
                      <AccordionTrigger className="hover:no-underline">
                        <CardHeader className="flex-1 text-left">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                              <ModuleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                            </div>
                            <div className="flex-1 space-y-2 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <CardTitle className="text-base sm:text-lg leading-tight">{module.title}</CardTitle>
                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                  <Badge className={`${getDifficultyColor(module.difficulty)} text-xs`}>
                                    {module.difficulty}
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                    <CategoryIcon className="w-3 h-3" />
                                    <span className="hidden sm:inline">{module.category}</span>
                                    <span className="sm:hidden">{module.category.charAt(0).toUpperCase()}</span>
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                {module.description}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                      </AccordionTrigger>
                      <AccordionContent>
                        <CardContent className="space-y-4 p-4 sm:p-6">
                          {module.content.sections.map((section, index) => (
                            <div key={index} className="space-y-2">
                              <h4 className="font-semibold text-sm sm:text-base">{section.title}</h4>
                              {renderContent(section)}
                            </div>
                          ))}
                        </CardContent>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>

        {/* Footer Stats */}
        <Card className="mb-8 mt-8">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
              <div>
                <div className="text-lg sm:text-2xl font-bold text-primary">{knowledgeModules.length}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Knowledge Modules</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-primary">
                  {knowledgeModules.filter(m => m.difficulty === 'beginner').length}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Beginner Friendly</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-primary">
                  {knowledgeModules.filter(m => m.difficulty === 'intermediate').length}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Intermediate</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-primary">
                  {knowledgeModules.filter(m => m.difficulty === 'advanced').length}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Advanced</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};