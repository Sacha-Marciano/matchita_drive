"use client";

import React, { useState } from "react";
import Button from "@/app/components/ui/Button";
import Select from "@/app/components/ui/Select";
import Tabs from "@/app/components/ui/Tabs";
import Tag from "../components/ui/Tag";
import VectorizationAnimation from "../components/Animations/EmbedAnimation";
import DuplicateCheckAnimation from "../components/Animations/DupCheckAnimation";
import ClassificationAnimation from "../components/Animations/ClassifyAnimation";

export default function CompPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>("");

  const selectOptions = [
    { value: "option1", name: "option 1" },
    { value: "option2", name: "option 2" },
    { value: "option3", name: "option 3" },
  ];

  const tabs = [
    { label: "Tab 1", content: <p>Content for Tab 1</p> },
    { label: "Tab 2", content: <p>Content for Tab 2</p> },
    { label: "Tab 3", content: <p>Content for Tab 3</p> },
  ];

  return (
    <div className="space-y-8 p-8">
      {/* Buttons */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <Button onClick={() => console.log("click")} size="sm">
            primary
          </Button>
          <Button onClick={() => console.log("click")}>Primary</Button>
          <Button onClick={() => console.log("click")} size="lg">
            primary
          </Button>
          <Button
            onClick={() => console.log("click")}
            size="sm"
            variant="secondary"
          >
            secondary
          </Button>
          <Button onClick={() => console.log("click")} variant="secondary">
            secondary
          </Button>
          <Button
            onClick={() => console.log("click")}
            size="lg"
            variant="secondary"
          >
            secondary
          </Button>
          <Button
            onClick={() => console.log("click")}
            size="sm"
            variant="disabled"
          >
            disabled
          </Button>
          <Button onClick={() => console.log("click")} variant="disabled">
            disabled
          </Button>
          <Button
            onClick={() => console.log("click")}
            size="lg"
            variant="disabled"
          >
            disabled
          </Button>
        </div>
      </div>

      {/* Selects */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Selects</h2>
        <div className="flex flex-wrap gap-8">
          {/* Default */}
          <div className="space-y-2">
            <Select
              label="Default"
              size="sm"
              value={selectedOption}
              options={selectOptions}
              onChange={setSelectedOption}
            />
            <Select
              label="Default"
              value={selectedOption}
              options={selectOptions}
              onChange={setSelectedOption}
            />
            <Select
              label="Default"
              size="lg"
              value={selectedOption}
              options={selectOptions}
              onChange={setSelectedOption}
            />
          </div>

          {/* Secondary */}
          <div className="space-y-2">
            <Select
              variant="secondary"
              size="sm"
              label="Secondary"
              value={selectedOption}
              options={selectOptions}
              onChange={setSelectedOption}
            />
            <Select
              variant="secondary"
              label="Secondary"
              value={selectedOption}
              options={selectOptions}
              onChange={setSelectedOption}
            />
            <Select
              variant="secondary"
              size="lg"
              label="Secondary"
              value={selectedOption}
              options={selectOptions}
              onChange={setSelectedOption}
            />
          </div>

          {/* Disabled */}
          <div className="space-y-2">
            <Select
              variant="disabled"
              size="sm"
              label="Disabled"
              value={selectedOption}
              options={selectOptions}
              onChange={setSelectedOption}
            />
            <Select
              variant="disabled"
              label="Disabled"
              value={selectedOption}
              options={selectOptions}
              onChange={setSelectedOption}
            />
            <Select
              variant="disabled"
              size="lg"
              label="Disabled"
              value={selectedOption}
              options={selectOptions}
              onChange={setSelectedOption}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Tabs</h2>
        <Tabs tabs={tabs} size="md" variant="primary" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Tabs</h2>
        <Tabs tabs={tabs} size="md" variant="secondary" />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Tags</h2>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Primary */}
          <Tag label="Primary sm" size="sm" />
          <Tag label="Primary medium tag" size="md" />
          <Tag
            label="Primary large tag with a really long label that should truncate"
            size="lg"
          />

          {/* Secondary */}
          <Tag label="Secondary sm" size="sm" variant="secondary" />
          <Tag label="Secondary medium" size="md" variant="secondary" />
          <Tag
            label="Secondary long long long long"
            size="lg"
            variant="secondary"
          />

          {/* Disabled */}
          <Tag label="Disabled sm" size="sm" variant="disabled" />
          <Tag label="Disabled medium" size="md" variant="disabled" />
          <Tag
            label="Disabled large tag that is too long and should truncate"
            size="lg"
            variant="disabled"
          />
        </div>
      </div>

      {/* Animations */}
      <div>
        <h2 className="text-xl font-semibold">Animations</h2>

        <div className="flex items-center justify-around px-10">
          <VectorizationAnimation />
          <DuplicateCheckAnimation />
          <ClassificationAnimation />
        </div>
      </div>
    </div>
  );
}
