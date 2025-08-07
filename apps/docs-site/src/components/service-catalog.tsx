
'use client';

import { useState, useMemo, ReactNode, useEffect, useRef } from 'react';
import { ImageCard } from '@/components/image-card';
import { ImageCardGroup } from '@/components/image-card-group';
import { Search, Filter, CheckCircle, Plus } from 'lucide-react';

interface Service {
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  category: string;
}

interface ServiceCatalogProps {
  services: Service[];
  categories: string[];
}

const ServiceCatalog = ({ services, categories }: ServiceCatalogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(prev =>
        prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev, category]
      );
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(service.category);
      const matchesSearch =
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategories, services]);

  const highlight = (text: string): ReactNode => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          style={{ backgroundColor: 'var(--color-fd-primary)', color: 'white' }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getFilterButtonText = () => {
    if (selectedCategories.length === 0) {
      return 'Showing all categories';
    }
    if (selectedCategories.length === 1) {
      return selectedCategories[0];
    }
    return `${selectedCategories.length} categories selected`;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or description"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-9 border rounded-lg bg-fd-card text-fd-foreground text-base h-[42px]"
          />
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full md:w-auto flex items-center justify-between gap-2 p-2 border rounded-lg bg-fd-card cursor-pointer text-fd-foreground text-base h-[42px]"
          >
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-4 h-4" />
              <span className="whitespace-nowrap">{getFilterButtonText()}</span>
            </div>
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 w-max min-w-full p-2 border rounded-lg bg-fd-popover shadow-lg z-10">
              <div
                className="flex items-center gap-3 p-2 cursor-pointer hover:bg-fd-muted"
                onClick={() => handleCategoryChange('all')}
              >
                <div
                  className={`w-4 h-4 border rounded-full flex items-center justify-center ${selectedCategories.length === 0 ? 'bg-fd-primary border-fd-primary' : 'border-gray-400'}`}>
                  {selectedCategories.length === 0 && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
                <label className="cursor-pointer">All Categories</label>
              </div>
              {categories.map(category => (
                <div
                  key={category}
                  className="flex items-center gap-3 p-2 cursor-pointer hover:bg-fd-muted"
                  onClick={() => handleCategoryChange(category)}
                >
                  <div
                    className={`w-4 h-4 border rounded-full flex items-center justify-center ${selectedCategories.includes(category) ? 'bg-fd-primary border-fd-primary' : 'border-gray-400'}`}>
                    {selectedCategories.includes(category) && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <label htmlFor={category} className="cursor-pointer">{category}</label>
                </div>
              ))}
            </div>
          )}
        </div>
        <a
          href="https://github.com/coollabsio/coolify"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-2 px-4 rounded-lg bg-fd-primary text-fd-primary-foreground dark:bg-purple-700 no-underline text-base h-[42px]"
        >
          <Plus className="w-4 h-4" />
          <span className="whitespace-nowrap =">Submit Service</span>
        </a>
      </div>

      {categories.map(category => {
        const servicesForCategory = filteredServices.filter(
          service => service.category === category
        );
        if (servicesForCategory.length === 0) return null;

        return (
          <div key={category}>
            <h3 className="text-lg font-bold mt-12 mb-2">{category}</h3>
            <ImageCardGroup>
              {servicesForCategory.map(service => (
                <ImageCard
                  key={service.title}
                  title={highlight(service.title)}
                  description={highlight(service.description)}
                  href={service.href}
                  imageSrc={service.imageSrc}
                />
              ))}
            </ImageCardGroup>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceCatalog;
