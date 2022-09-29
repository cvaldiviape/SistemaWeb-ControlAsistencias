<?php

namespace App\Resources;

use App\Models\Category;
use League\Fractal;

class CategoryResources
{
    public function get()
    {
        $categories = Category::all();
        $resource   = new Fractal\Resource\Collection($categories, function (Category $category) {
            return [
                'category_id'   => $category->category_id,
                'category_name' => $category->name,
                'subcategories' => $category->subCategories()->get(),
            ];
        });

        $fractal = new Fractal\Manager();

        return $fractal->createData($resource)->toArray();
    }
}