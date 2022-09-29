<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\Category;

class CategoryTransformer extends TransformerAbstract
{
    public static function transform($category)
    {
        return [
            'category_id'   => $category->category_id,
            'name'          => $category->name,
            'subcategories' => $category->subCategories()->get(),
        ];
    }
}