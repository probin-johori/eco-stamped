import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { SustainableFeature } from '@/lib/brands';

interface Feature {
  title: SustainableFeature;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
  IconMap: Record<string, LucideIcon>;
  sustainableFeatureDefinitions: Record<SustainableFeature, string>;
  isExpanded: boolean;
}

interface ExpandableFeaturesProps {
  features: Feature[];
  IconMap: Record<string, LucideIcon>;
  sustainableFeatureDefinitions: Record<SustainableFeature, string>;
}

const FeatureGrid = ({ features, IconMap, sustainableFeatureDefinitions, isExpanded }: FeatureGridProps) => {
  // Show 3 items on mobile, 4 on desktop when not expanded
  const displayFeatures = isExpanded 
    ? features 
    : features.slice(0, typeof window !== 'undefined' && window.innerWidth < 640 ? 3 : 4);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {displayFeatures.map((feature) => {
        const iconName = sustainableFeatureDefinitions[feature.title];
        const IconComponent = IconMap[iconName];
        
        console.log('Feature mapping:', {
          featureTitle: feature.title,
          iconName,
          hasIcon: !!IconComponent
        });

        if (!IconComponent) {
          console.warn(`Icon not found for feature ${feature.title} with icon name ${iconName}`);
          return null;
        }

        return (
          <div key={feature.title} className="flex items-start gap-3 mb-0 sm:mb-8">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <div className="w-6 h-6">
                <IconComponent strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <div className="text-base sm:text-md font-semibold text-foreground mb-0.5 sm:mb-2">
                {feature.title}
              </div>
              <div className="text-sm text-muted-foreground">
                {feature.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ExpandableFeatures = ({ features, IconMap, sustainableFeatureDefinitions }: ExpandableFeaturesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  console.log('ExpandableFeatures props:', {
    featuresCount: features?.length,
    iconMapKeys: Object.keys(IconMap),
    definitionKeys: Object.keys(sustainableFeatureDefinitions)
  });

  if (!features || features.length === 0) {
    return null;
  }

  if (features.length <= 4) {
    return (
      <FeatureGrid
        features={features}
        IconMap={IconMap}
        sustainableFeatureDefinitions={sustainableFeatureDefinitions}
        isExpanded={true}
      />
    );
  }

  return (
    <div className="space-y-12">
      <FeatureGrid
        features={features}
        IconMap={IconMap}
        sustainableFeatureDefinitions={sustainableFeatureDefinitions}
        isExpanded={isExpanded}
      />
      <div className="flex sm:justify-center">
        <Button
          variant="secondary"
          className="text-sm font-medium hover:text-foreground transition-colors rounded-full sm:w-auto w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <span className="flex items-center gap-2 justify-center">
              Show less <Icons.ChevronUp className="w-4 h-4" />
            </span>
          ) : (
            <span className="flex items-center gap-2 justify-center">
              See more <Icons.ChevronDown className="w-4 h-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ExpandableFeatures;
