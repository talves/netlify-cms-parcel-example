var PostPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    return h('div', {},
      h('div', {className: "cover"},
        h('h1', {}, entry.getIn(['data', 'title'])),
        this.props.widgetFor('image'),
      ),
      h('p', {},
        h('small', {}, "Written " + entry.getIn(['data', 'date']))
      ),
      h('div', {"className": "text"}, this.props.widgetFor('body'))
    );
  }
});

var GeneralPreview = createClass({
  render: function() {
    var entry = this.props.entry;
    var title = entry.getIn(['data', 'site_title']);
    var posts = entry.getIn(['data', 'posts']);
    var thumb = posts && posts.get('thumb');

    return h('div', {},
      h('h1', {}, title),
      h('dl', {},
        h('dt', {}, 'Posts on Frontpage'),
        h('dd', {}, this.props.widgetsFor('posts').getIn(['widgets', 'front_limit']) || 0),

        h('dt', {}, 'Default Author'),
        h('dd', {}, this.props.widgetsFor('posts').getIn(['data', 'author']) || 'None'),

        h('dt', {}, 'Default Thumbnail'),
        h('dd', {}, thumb && h('img', {src: this.props.getAsset(thumb).toString()}))
      )
    );
  }
});

var AuthorsPreview = createClass({
  render: function() {
    return h('div', {},
      h('h1', {}, 'Authors'),
      this.props.widgetsFor('authors').map(function(author, index) {
        return h('div', {key: index},
          h('hr', {}),
          h('strong', {}, author.getIn(['data', 'name'])),
          author.getIn(['widgets', 'description'])
        );
      })
    );
  }
});

const RelationKitchenSinkPostPreview = createClass({
  render: function() {
    // When a post is selected from the relation field, all of it's data
    // will be available in the field's metadata nested under the collection
    // name, and then further nested under the value specified in `valueField`.
    // In this case, the post would be nested under "posts" and then under
    // the title of the selected post, since our `valueField` in the config
    // is "title".
    const { value, fieldsMetaData } = this.props;
    const post = fieldsMetaData && fieldsMetaData.getIn(['posts', value]);
    const style = { border: '2px solid #ccc', borderRadius: '8px', padding: '20px' };
    return post ? h('div', { style: style },
      h('h2', {}, 'Related Post'),
      h('h3', {}, post.get('title')),
      h('img', { src: post.get('image') }),
      h('p', {}, post.get('body', '').substr(0, 100) + '...'),
    ) : null;
  }
});

const previewStyles = `
  html,
  body {
    color: #444;
    font-size: 14px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body {
    padding: 20px;
  }

  h1 {
    margin-top: 20px;
    color: #666;
    font-weight: bold;
    font-size: 32px;
  }

  img {
    max-width: 100%;
  }
`;

CMS.registerPreviewTemplate("posts", PostPreview);
CMS.registerPreviewTemplate("general", GeneralPreview);
CMS.registerPreviewTemplate("authors", AuthorsPreview);
CMS.registerPreviewStyle(previewStyles, { raw: true });
// Pass the name of a registered control to reuse with a new widget preview.
CMS.registerWidget("relationKitchenSinkPost", "relation", RelationKitchenSinkPostPreview);
CMS.registerEditorComponent({
  id: "youtube",
  label: "Youtube",
  fields: [{name: 'id', label: 'Youtube Video ID'}],
  pattern: /^{{<\s?youtube (\S+)\s?>}}/,
  fromBlock: function(match) {
    return {
      id: match[1]
    };
  },
  toBlock: function(obj) {
    return '{{< youtube ' + obj.id + ' >}}';
  },
  toPreview: function(obj) {
    return (
      '<img src="http://img.youtube.com/vi/' + obj.id + '/maxresdefault.jpg" alt="Youtube Video"/>'
    );
  }
});
