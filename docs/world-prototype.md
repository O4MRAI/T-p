# هسيس تشرين — مرجع النسخة التجريبية

المصدر: صور مخطط صاحب المشروع (خمس صفحات)، المرسلة في 20 أكتوبر 2026.
توجيه المستخدم: يمكن الاعتماد على محتوى وتخزين مؤقتين إلى حين استكمال العمل.
التوجيه البصري الأخير: مرجع بصري قدّمه المستخدم لواجهة مقتنيات عتيقة؛ ورق عاجي معتّق، حبر بني، زخارف قديمة، كتب ومفاتيح وريشة وساعة. حلّ هذا الاتجاه محل التصميم الداكن السابق.

## ما يمكن تجربته الآن

- ورقة افتتاحية، باب رئيسي، وفهرس للأركان الثلاثة عشر؛ بحث وتصفية حسب الفئة.
- مداخل تحمل أسماء الأركان داخل الغرفة الثلاثية الأبعاد، مع فهرس يصلح للجوال ولو لم يكتمل تحميل الغرفة.
- كلمات الدخول من المخطط، وإمكانية تجاوزها عمدًا بزر «دخول تجريبي سريع» وتلميحات ظاهرة عند الطلب.
- إضافة وتعديل وحذف النصوص والذكريات والقصائد والفصول، وإرفاق الصور والفيديو والصوت من الجهاز.
- مكتبة وأغلفة، حالة قراءة، تقييمات واقتباسات وتصفية.
- مهام وعادات قابلة للتجربة؛ أول إنجاز وسبعة إنجازات إضافية، دون انتظار أيام فعلية.
- جورنال متعدد الصفحات: نصوص وصور وملصقات، سحب وتغيير الحجم والميل، وتحريك بالأسهم بلوحة المفاتيح.
- روابط الصوت في إعدادات الأركان؛ التشغيل باختيار المستخدم، أو اختيار تسجيل من الجهاز.
- تلميحات حالة الثعلب حسب الركن، وتوقف حركته في الغرفة عند الرجوع إليها من ركن يُسر بعادة غير مكتملة.
- مرسيدس W13 من الملف الذي أرسله صاحب المشروع، بنسختين للكمبيوتر والجوال.

## حدود هذه المرحلة

إضافات الأركان الجديدة موجودة في ذاكرة الصفحة فقط؛ تحديثها يصفرها ويغلق الأبواب المفتوحة.
لم نغيّر حفظ الكتب الموجود سابقًا في الغرفة باستخدام localStorage.
كلمات الأبواب جزء من التجربة وليست مصادقة أو خصوصية حقيقية.
لا توجد حسابات أو قاعدة بيانات أو رفع ملفات إلى خادم.
لا يوجد تشغيل موسيقى تلقائي قبل تفاعل المستخدم؛ عرض يوتيوب يعتمد على إتاحة المقطع والتضمين والاتصال.
الصوت المطري يختاره المستخدم من جهازه حاليًا؛ لا نولّد ملف مطر أو نفترض ترخيص تسجيل خارجي.
الأزياء المفصلة للثعلب، وتتبع العادات حسب التواريخ، وتخزين وتشغيل قوائم الموسيقى، والتفاصيل المنفردة لكل مجسّم مرحلة لاحقة.
نص الورقة وكلمات الأبواب منقولان من صور صغيرة؛ يُراجعان على النص الأصلي قبل اعتماد النسخة النهائية حرفيًا.

## الملفات

- `assets/world/sections.js`: أسماء الأركان، الكلمات، وصف الأجواء، مواقع المداخل، روابط الموسيقى، وهوية الافتتاحية.
- `assets/world/world.js`: واجهات وتجارب الأركان وإدارة الحالة المؤقتة.
- `assets/world/world.css`: الواجهة العربية المتجاوبة بطابع الورق العتيق والحبر البني.
- `index.html`: الغرفة، المداخل الثلاثية الأبعاد، وربط التفاعل مع الواجهة.

## الأركان المطلوبة

ثلاثي الأرق، على ضفاف من حبر، طاولة، ألبير كامو، 167، يُسر، أحمد شوقي، سبيستون، الفورمولا ون / مرسيدس، AC Milan / كاكا، الجورنال، 20:52 / الإسبريسو، مكتبتي.

## الخطوط

Alexandria للنصوص والأزرار والعناوين بأوزان 400 و500 و600 و700، وAref Ruqaa لتوقيع «هسيس تشرين» والورقة الافتتاحية بأوزان 400 و700. ملفات WOFF2 محلية مع رخص SIL Open Font License في `assets/fonts/`؛ لا يتطلب تحميل الخطوط اتصالًا بخدمة خارجية.

## المرجع البصري الأخير

واجهة أخف وأدفأ مستوحاة من صورة المستخدم لموقع مقتنيات عتيقة. عنوان توقيعي بالرقعة، شريط تنقل ورقي، بطاقات مزخرفة بحواف غير منتظمة، وزخارف مفتاح وساعة على الهوامش. صورة `assets/world/antique-hero.webp` مولّدة خصيصًا لهذه النسخة؛ تجمع الكتب والريشة والساعة والمفتاح والثعلب، مع تلاشي حوافها في الورق. لا تُستخدم صورة المرجع نفسها كخلفية أو واجهة.

## مطابقة توزيع المرجع

اعتمدت الصفحة الرئيسية توزيع المرجع المرفق بدل الاكتفاء بالأسلوب اللوني: عمود محتوى ضيق، شريط ورقي، كولاج أعمدة وكتب فوق السحاب مع بحث صغير، أربع بطاقات أساسية، لوحة كتابة بالريشة والختم، معاينة للغرفة إلى جانب وصف المكان، لوحة عدادات وآخر الإضافات بساعة رملية، ثم شريط الاهتمامات والتوقيع. الزخارف صور مستقلة لمفتاح وبطاقات بريد وساعة وكتب. تبقى الأركان الـ13 قابلة للوصول؛ أربعة ظاهرة أولًا والتسعة الباقية في الفهرس القابل للتوسيع، والبحث يعرض نتائج الأركان كلها.

يمكن إرسال أول سطر من لوحة الكتابة إلى ركن الحبر؛ ويعرض سجل الصفحة أعداد الكتب والنصوص والخطوات المكتملة وآخر الإضافات الحقيقية لهذه الجلسة. معاينة الغرفة تفتح المشهد الحقيقي، وروابط الاهتمامات تفتح الأركان المقابلة. الصورة الجديدة `cloud-cabinet.webp` وزخارف `prop-*.webp` مولّدة لهذه النسخة، ومعاينة الغرفة مأخوذة من عرض المشروع الفعلي.

The opening uses the owner's corrected text verbatim, with no dedication, on a textured letter over a warm wooden desk. The animated fox and leaf entry remain interactive. Paper edges and folds are generated assets, with decorative map engraving on navigation/archive. Books receive leather-style covers; collection cards use layered paper. The journal presents an active editable page with its paired page preview and real page tabs; “write on this page” selects the paired page for editing. On small screens the paired pages stack. Content remains temporary in memory.

## October 20 additional brief (visible pages 1–3)
Journal now offers plain, lined, grid, dotted, antique and uploaded raster backgrounds per page. A starter tray includes decorative symbols, sticky notes, washi tape, empty frames and stamps; uploaded images/PNG are supported. Items can be dragged, resized, rotated and layered. Pointer-based ink, pencil and marker drawing supports color, width and undo. Export/import a JSON journal to retain drawings and embedded images across visits; importing appends pages rather than replacing existing work. This is manual file saving, not automatic cloud sync. Physical tablet/stylus hardware has not been tested.

Corners now have differentiated palettes/backgrounds, including Milan stripes, Spacetoon stars and a coffee-table atmosphere for 20:52 (its title is now just 20:52). Fox avatar colors follow these corners; a fully articulated fox with costumes remains future work. The separate MP3 entry provides multiple temporary playlists, audio uploads, native seek/volume, previous/next and three skins (vinyl, classic, stereo). Audio files and playlists still reset on reload. Page four of the additional brief was not supplied.

## October 21 revision
Removed embedded YouTube playback. A shared audio-only player accepts separate temporary uploads for the opening, corner index, 3D room and each corner, automatically attempts playback on entry, and retries blocked playback after a user gesture. No remote audio has been downloaded or substituted; the owner's upcoming MP3 files are still required for the intended default soundtrack. Reference YouTube IDs remain source metadata only.

Journal adds bounded per-page undo/redo, an eraser that removes touched ink strokes, a prominent delete-selected action, custom local font upload for scrap text, and pen-pointer handling independent of the touch selection mode. Pointer coalescing now falls back when no samples are returned. Uploaded fonts last for the visit and are not embedded in exported journals. Album art belongs to each track and changes when tracks change. No automatic permanent storage was introduced.
